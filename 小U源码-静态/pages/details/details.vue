<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="baseUrl+obj.img">
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{obj.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">
				<label style="color: red;">￥ {{obj.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>
		</view>

		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
					<label class="jian" @click="sup">-</label>
					<label class="zhi">{{num}}</label>
					<label class="jia" @click="add">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{obj.specsname}}</label>
					<view class="threed3i1" v-for="(item,index) in attr" :key='index'>{{item}}</view>

				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<!-- <image src="/static/detail/2.jpg" mode="aspectFill"/> -->
			<view class="" v-html="obj.description">

			</view>
		</view>

		<view class="productEval">
			<view class="eval">商品评价</view>
			<view>
				<label class="evalUsername">小李白</label>
				<label class="evalUsertitle">效果很好，物流到位，下次继续来</label>
				<view class="evalImage">
					<image src="../../static/detail/pingjia1.jpg" />
					<image src="../../static/detail/pingjia2.jpg" />
					<image src="../../static/detail/pingjia3.jpg" />

				</view>
				<label class="evalTime">2020-01-13</label>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="addShop">加入购物车</button>
			<button class="footbtn2" @click="buy">立即购买</button>
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
				obj: {},
				baseUrl: baseUrl,
				attr: [],
				num: 1,
			}
		},
		async onLoad(e) {
		
			var res = await myRequest('/api/getgoodsinfo', {
				id: e.id
			})
			this.obj = res.list[0]
			
			// console.log(this.obj)
			this.attr = res.list[0].specsattr.split(',')

		},
		methods: {
			//点击减号
			sup() {
				this.num <= 1 ? this.num : --this.num
			},
			// 点击加号
			add() {
				console.log('add')
				this.num++
			},
			//计入购物车
			async addShop() {
				var info = uni.getStorageSync('userinfo')
				var res = await myRequest('/api/cartadd', {
					uid: info.uid,
					goodsid: this.obj.id,
					num: this.num
				}, 'get', {
					authorization: info.token,
					'content-type': 'application/x-www-form-urlencoded'
				})
				if(res.code==200){
					uni.showToast({
						title:'添加成功',
						mask:true
					})
				}else if(res.code==403){
					uni.showToast({
						title:'用户未登录或登录过期',
						icon:'none'
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:'../send/send'
						})
					},1500)
				}
				console.log(res)
			},
			// 立即购买
			/* buy(){
				// 订单信息存入
				this.obj.num=this.num
				var good = [this.obj]
				uni.setStorageSync('order',good)
				uni.navigateTo({
					url:'../confirm/confirm'
				})
			} */
		}
	}
</script>
<style>
	@import url("../../common/css/details.css");
</style>
