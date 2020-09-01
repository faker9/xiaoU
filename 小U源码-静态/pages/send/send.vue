<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone" maxlength="12" />
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text @click="getCode" v-if="!show">发送</text> <text v-else>{{show}}</text>
			</view>
			<input type="text" v-model="code" placeholder="- - - -" maxlength="4" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<!--   -->
			<button type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;" @click="login" :disabled="isLogin">登录</button>
		</view>
		<view class="row">
			<text style="color: #006699;text-align: center;">通过微信授权登录</text>
		</view>
	</view>
</template>

<script>
	import {
		myRequest,
		baseUrl
	} from '@/utils/tool'
	export default {
		data() {
			return {
				phone: '',
				code: '',
				show: 0,
				isLogin:true,
				//验证规则
				rules: {
					phone: {
						rule: /^[0-9]{11,11}$/,
						msg: '手机号必须为11位数字'
					},
					code: {
						rule: /^[0-9a-zA-Z]{4,4}$/,
						msg: '验证码错误'
					}
				}
			}
		},
		watch:{
			code:function(){
				if(this.code.length==4){
					this.isLogin=false
				}else{
					this.isLogin=true
				}
			}
		},
		methods: {
			//获取验证码
			async getCode() {
				if (!this.validate('phone')) {
					return
				}
				this.show = 10
				var res = await myRequest('/api/sms', {
					phone: this.phone
				})
				uni.setStorageSync('code', res.list.code)
				var time = setInterval(() => {
					this.show--
					if (this.show == 0) {
						clearInterval(time)
					}
				}, 1000)
			},
			//判断验证是否符合要求，合法性校验
			validate(key) {
				if (!this.rules[key].rule.test(this[key])) {
					//提示信息
					uni.showToast({
						title: this.rules[key].msg,
						icon: 'none',
						position: 'top'
					})
					return false;
				}
				return true;
			},
			//登录
			async login() {
				if (!this.validate('phone')||!this.validate('code'))
					return
				//验证码不正确弹框报警
				if (this.code != uni.getStorageSync('code')) {
					uni.showToast({
						title: '请正确填写验证码',
						icon: 'none'
					})
				} else { //登录
					var res = await myRequest('/api/wxlogin', {
						phone: this.phone
					})
					uni.setStorageSync('userinfo', res.list)
					uni.reLaunch({
						url: '../index/index'
					})
				}
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	/* @import url("../../common/css/index.css"); */
	.box {
		position: relative;
	}

	.row {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}

	.send {
		display: flex;
		justify-content: space-between;
	}

	.send text:nth-of-type(2) {
		color: #00BB00;
	}

	text {
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}

	input {
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}
</style>
