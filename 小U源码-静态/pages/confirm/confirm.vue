<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:悟空</label>
				<label for="">18301628393</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">花果山水帘洞27号</label>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">

			<view class="cartsInfo" v-for="(item,index) in orderList" :key='item.id'>
				<!-- 70px -->
				<view class="carts_detail">
					<view class="carts_image">
						<image :src="baseUrl+item.img" mode=""></image>
					</view>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:300</view>
					</view>
					<view class="carts_price">
						<label for="">￥ {{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian" @click="sup" :id='index'>-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia" @click="add" :id='index'>+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>


			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use">
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥{{allPrice}}</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{ allPrice }}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="pay">提交订单</button>
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
				orderList: [],
				baseUrl: baseUrl
			}
		},
		onLoad() {
			this.info = uni.getStorageSync('userinfo')
			this.orderList = uni.getStorageSync('order')
			console.log(this.orderList)
		},
		methods: {
			//数量减少
			sup(e) {
				console.log(e)
				var index = e.currentTarget.id
				if (this.orderList[index].num > 1) {
					this.orderList[index].num--
					this.edit(this.orderList[index].id, this.orderList[index].num, this.orderList[index].checked)
				}
			},
			//数量增多
			async add(e) {
				console.log(e)
				var index = e.currentTarget.id
				this.orderList[index].num++
				this.edit(this.orderList[index].id, this.orderList[index].num, this.orderList[index].checked)
			},
			//购物车数量编辑
			async edit(id, num, checkd) {
				var res = await myRequest('/api/cartedit', {
					id: id,
					num: num,
					checked: checkd
				}, 'get', {
					authorization: this.info.token,
					'content-type': 'application/x-www-form-urlencoded'
				})
			},
			async pay(){
				var idstr = ''
				this.orderList.forEach((item,index)=>idstr+=(index>0?','+item.id:item.id))
				var date1 = {
					uid:this.info.uid,
					username:'nine',
					userphone:this.info.phone,
					address:'江北以北',
					countmoney:this.allPrice,
					countnumber:this.count,
					addtime:new Date().getTime(),
				}
			
				var params = JSON.stringify(date1)
				console.log(params,idstr)
				var res = await myRequest('/api/orderadd',{params,idstr},'get',{
						authorization: this.info.token,
						'content-type': 'application/x-www-form-urlencoded'
					})
					console.log(res)
					if(res.code==200){
						uni.showToast({
							title:res.msg
						})
						setTimeout(()=>{
							uni.reLaunch({//成功后跳转到购物车
								url:'../cart/cart'
							})
						},2000)
					}
					
			}
		},
		computed:{
			allPrice:function(){
				var sum = 0
				this.count=0
				this.orderList.forEach(item=>{
					this.count += item.num
					sum+=item.price*item.num
				})
				return sum		
			}
		}
	}
</script>
<style>
	@import url("../../common/css/confirm.css");
</style>
