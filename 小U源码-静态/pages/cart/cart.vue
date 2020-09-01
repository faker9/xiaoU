<template>
	<view class="container">
		<view class="top" v-if="cartList.length!==0">
			<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" v-for="(item,index) in cartList" :key='item.id'>
				<view class="cartInfo" id="demo1">
					<!-- 购物车商品信息 -->
					<view class="cartInfochild">
						<!-- 选择框 -->
						<view class="cartInfo_switch common">
							<!-- 点击当前商品 -->
							<switch type="checkbox" :checked="item.checked" @change="check" :id="index" />

						</view>
						<!-- 图片 -->
						<view class="cartInfo_image common">
							<image :src="baseUrl+item.img" mode=""></image>
						</view>

						<!-- 信息 -->
						<view class="cartInfo_info">
							<label for="" style="font-size: 26rpx;" class="goodname">{{item.goodsname}}</label>
							<label for="" style="font-size: 24rpx; color: #ccc;">规格：黑色</label>
							<label for="" style="color: red;">￥{{item.price}}</label>
						</view>
						<!-- 加减数量 -->
						<view class="cartInfo_num">
							<view class="cartInfo_num_child">
								<label for="" @click="sup" :id='index'>-</label>
								<label for="">{{item.num}}</label>
								<label for="" @click="add" :id='index'>+</label>
							</view>
						</view>
					</view>
				</view>
				<view class="cartDel" id="demo2"><label for="" @click="del" :id='index'>删除</label></view>
			</scroll-view>
		</view>
		<view class="tishi" v-else>
			没有数据亲！
		</view>
		<!-- 底部 -->
		<view class="foot">
			<view class="footd1">
				<switch type="checkbox" :checked="checkAll" @change="checkedAll" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">
					总计：
					<label style="color: red;">{{sum}}</label>
				</view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="goOrder">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{count}}件)</label>
			</view>
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
				baseUrl: baseUrl,
				cartList: [],
				info: {},
				count: 0,
			}
		},
		async onLoad() {
			this.info = uni.getStorageSync('userinfo')
			var res = await this.getList()
			console.log(this.cartList.length !== 0)
		},

		onShow() {
			this.getList()
		},
		methods: {
			async getList() {
				var res = await myRequest('/api/cartlist', {
					uid: this.info.uid
				}, 'get', {
					authorization: this.info.token,
					'content-type': 'application/x-www-form-urlencoded'
				})
					console.log(res)
					if(res.code==403){
						await uni.showToast({
							title:res.msg,
							icon:'none',
							duration:2000,
							
						})
						setTimeout(()=>{
							uni.reLaunch({
								url:'../send/send',
								icon:'none'
							})
						},2000)
						
					}
				if (!res.list) {
					return
				}
				this.cartList = res.list
			
			},
			check(e) { //点击更改选中状态
				var i = e.currentTarget.id
				if (e.detail.value == false) {
					this.cartList[i].checked = 0
				} else {
					this.cartList[i].checked = 1
				}
				//选中状态记录到数据库
				this.edit(this.cartList[i].id, this.cartList[i].num, this.cartList[i].checked)
			},
			checkedAll(e) { //点击全选
				this.cartList.forEach(item => {
					item.checked = e.detail.value
				})

			},
			//数量减少
			async sup(e) {
				var index = e.currentTarget.id
				if (this.cartList[index].num > 1) {
					this.cartList[index].num--
					this.edit(this.cartList[index].id, this.cartList[index].num, this.cartList[index].checked)
				}
			},
			//数量增多
			async add(e) {
				var index = e.currentTarget.id
				this.cartList[index].num++
				this.edit(this.cartList[index].id, this.cartList[index].num, this.cartList[index].checked)
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
			async del(e) { //删除购物车中该商品
				var i = e.currentTarget.id
				uni.showModal({
					title: '删除',
					content: '是否确认删除',
					success: async res2 => {
						if (res2.confirm) {
							var res = await myRequest('/api/cartdelete', {
								id: this.cartList[i].id
							}, 'get', {
								authorization: this.info.token,
								'content-type': 'application/x-www-form-urlencoded'
							})
							if (res.code == 200) {
								uni.showToast({
									title: '删除成功'
								})
								this.cartList.splice(i, 1)
						}}
					}
				})
				
				

			},

			//去往订单页
			goOrder() {
				if(this.count==0){
					uni.showToast({
						title:'请选择商品',
						icon:'none'
					})
					return
				}
				var arr = this.cartList.filter(item => {
					return item.checked == 1
				})
				//存入本地存储
				// console.log(arr)
				uni.setStorageSync('order', arr)
				//跳转到订单页
				uni.navigateTo({
					url: '../confirm/confirm'
				})
			}
		},
		computed: {
			sum: function() {
				this.count = 0
				var sum = 0
				if (!this.cartList) {
					return 0
				}
				this.cartList.forEach(item => {
					if (item.checked == 1) {
						sum += item.num * item.price
						this.count += item.num
					}
				})
				return sum
			},
			//全选
			checkAll: function() {
				if (!this.cartList) {
					return
				}
				if (this.cartList.length == 0) {
					return false
				}
				return this.cartList.every(item => {
					return item.checked == 1
				})
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getList()
			uni.stopPullDownRefresh()
		}
	};
</script>

<style>
	@import url('../../common/css/cart.css');

	.scroll-view_H {
		height: 200rpx;
	}
	.goodname{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.cartInfo_image_img {
		width: 120rpx;
		height: 120rpx;
	}
</style>
