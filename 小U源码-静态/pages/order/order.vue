]<template>
	<!-- <uni-search-bar @confirm="search" @input="input" ></uni-search-bar> -->
	<view>
		<uni-search-bar radius="100" bgColor="#ffff"></uni-search-bar>
		<view class="list"  >
			<view class="row" v-for="item in orderList" :key='item.id' v-if="orderList.length!=0">
				<view class="products" v-for="(it,i) in item.child" :key='i' >
					<view class="imagebox" v>
						<image :src="baseUrl+it.img" mode="widthFix"></image>
						<text>{{it.goodsname}}</text>
					</view>
				</view>
				<view class="info">
					<text  space="nbsp">总计{{item.countnumber}}商品  </text>  
					<text>应付金额 ￥{{item.countmoney}}</text>
				</view>
			</view>
			<view class="tishi" v-else>
				没有数据亲！
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		myRequest,
		baseUrl
	} from '@/utils/tool'
	export default{
		data(){
			return{
				orderList:[],
				baseUrl:baseUrl
			}
		},
		async onLoad(){
			this.info = uni.getStorageSync('userinfo')
			var res = await myRequest('/api/orders',{uid:this.info.uid},'get',{
					authorization: this.info.token,
					'content-type': 'application/x-www-form-urlencoded'
				})
				console.log(res.list)
				if(!res.list){
					return
				}
			this.orderList = res.list
			console.log(this.orderList)
		}
		
	}
</script>
<style>

	.row{
		margin: 10rpx 20rpx;
		/* height: 240rpx; */
		border: 1rpx solid #AAAAAA;
		border-radius: 30rpx;
	}
	
	.imagebox{
		float: left;
		margin:10rpx;
	}
	.products{
		overflow: hidden;
	}
	image{
		width: 160rpx;
		margin-left: 10rpx;
	}
	.info{
		/* position: absolute;
		top: 180rpx;
		right: 50rpx; */
		display: flex;
		justify-content: space-between;
		font-size: 25rpx;
		/* width: 340rpx; */
		padding: 20rpx;
		text-align: right;
	}
	.info text:nth-of-type(2){
		color: red;
	}
	.info text:nth-of-type(3){
		font-size: 20rpx;
		color: #AAAAAA;
	}
	.tishi{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>
