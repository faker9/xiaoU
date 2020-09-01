<template>
	<view class="container">
		<!-- left左侧列表 -->
		<view class="left">
			<!-- 循环遍历的 -->
			<view :class="activeId==index?'left_list activeList':'left_list'" v-for="(item,index) in List" :key='item.id' :id="index"
			 @click="onclick" :data-id='item.id'>
				<label for="">{{item.catename}}</label>
			</view>

		</view>
		<!-- right右侧详细分类商品 -->
		<view class="right">
			<!-- 每一个小类 -->
			<view class="right_list" v-if="goodList.length!=0">
				<!-- 商品 -->
				<view class="bottom">
					<view class="bottom_list" v-for="(item,index) in goodList" :key='index' @click="toDetail" :id='item.id'>
						<!-- 每个最多显示6个 -->
						<view>
							<image :src="baseUrl+item.img" alt="">
						</view>
						<view class="title">
							<span class='goodname'>{{item.goodsname}}</span>
						</view>
					</view>
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
	export default {
		data() {
			return {
				List: [],
				activeId: 0,
				goodList: [],
				baseUrl: baseUrl
			}
		},
		async mounted() { //获取数据渲染页面
			var res = await myRequest('/api/getcates')
			console.log('ww', res)
			this.List = res.list
			this.getgoodList(this.List[0].id)


		},
		methods: {
			//点击左侧选项时
			onclick(e) {
				this.activeId = e.currentTarget.id
				var id = e.currentTarget.dataset.id
				this.getgoodList(id)
				

			},
			// 获取右侧数据
			async getgoodList(id) {
				var res = await myRequest('/api/getcategoods', {
					fid: id
				})
				console.log(res)
				if(res.list){
					this.goodList = res.list
				}else{
					this.goodList =[]
				}
				
			},
			//去详情
			toDetail(e) {
				console.log(e.currentTarget.id)
				uni.navigateTo({

					url: '../details/details?id=' + e.currentTarget.id
				})
			},
		},
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");
	.tishi{
		text-align: center;
		margin-top: 20rpx;
	}
	.left_list {
		padding-right: 10rpx;
		border-left: 6rpx solid transparent;
	}

	/* 点击左侧导航，显示动态样式 */
	.activeList {
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}

	.container .left {
		font-size: 32rpx;
		width: 200rpx !important;
	}

	.right {
		width: 500rpx;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
	}

	.bottom_list {
		width: 240rpx;
	}
	.goodname{
		display: inline-block;
		/* 	width: 30%; */
		height: 70rpx;
		overflow: hidden;
	/* 	white-space: nowrap;
		text-overflow: ellipsis; */
	}
</style>
