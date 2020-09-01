<template>
	<view class="">
		<!-- 顶部信息 -->
		<view class="HomeTop">
		  <view class="logoView">
			<!-- logo -->
			<img class="logo" src="@/static/index/logo.jpg" alt="" />
		  </view>
		  <view class="inputView">
			<input class="textinput" style="center" type="text"   placeholder="寻找商品"/>
		  </view>
		</view>
		<!-- 顶部导航  scroll-view -->
		<view class="tabs">
		    <scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false">
		        <view class="uni-tab-item" 	:data-current="-1" @click="toFirst" >
		            <text :class="active == -1?'uni-tab-item-title uni-tab-item-title-active':'uni-tab-item-title'" >
						推荐
					</text>
		        </view>
			<!-- class="{'uni-tab-item' :true,'uni-tab-item-title-active':active == index" -->
				<view class="uni-tab-item" v-for="(item,index) in firstList"    :data-current="index" @click="toFirst"  :key='index' :id='item.id' >
				   <text :class="active == index?'uni-tab-item-title uni-tab-item-title-active':'uni-tab-item-title'">
				   	{{item.catename}}
				   </text>
				</view>
				
		    </scroll-view> 
		</view>
		<!-- 推荐轮播图 -->
		<view class="">
			<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000">
				<swiper-item v-for="item in bannerList" :key='item.id'>
					<view class="swiper-item">
						<image :src="item.img"  mode="heightFix"></image>
					</view>
				</swiper-item>
			
				
			</swiper>
		</view>
		
		<!-- 功能导航开始 -->
		<!-- 功能导航 -->
		<view class="FunctNavCon">
		  <view class="FunctNavLi" >
			<image src="../../static/index/xiaohuoban.png" alt class="FunImg" />
			<p>限时抢购</p>
		  </view>
		  <view class="FunctNavLi">
		  			<image src="../../static/index/jifentixicopy.png" alt class="FunImg" />
		  			<p>积分商城</p>
		  </view>
		  <view class="FunctNavLi">
		  			<image src="../../static/index/lianxiwomen.png" alt class="FunImg" />
		  			<p>联系我们</p>
		  </view>
		  <view class="FunctNavLi" @click="toSort" >
		  			<image src="../../static/index/-shangpinfenlei-gai.png" alt class="FunImg" />
		  			<p>限时抢购</p>
		  </view>
		</view>
		
		<!-- 推荐部分 秒杀-->
		<view class="HotGoods">
			<!-- 热推左侧 -->
			<view class="HotLeft">
				<view class="LimitedContent">
				  <image class="LimitedImg" src="../../static/index/xianshi.jpg" alt />
				  <label class="Limited">限时秒杀</label>
				</view>
				<p class="LimitedTitle">每天零点场，好货秒不停</p>
				<!-- 倒计时 -->
				<view class="LimitTimeAll">
				  <label class="LimitTime">{{time[0]}}</label>
				  <view class="maohao">:</view>
				  <label class="LimitTime">{{time[1]}}</label>
				  <view class="maohao">:</view>
				  <label class="LimitTime">{{time[2]}}</label>
				  <label class="Seckill">秒杀</label>
				</view>
				<image src="../../static/index/goods2.jpg" class="LimitedgoodsImg" alt="">
			</view>
			
			<!-- 热推右侧 -->
			<view class="HotRight">
				<!-- 右侧顶部部分 -->
				<view class="HotTop">
					<view class="HomeTopInfo">
						<view class="HomeTopInfoOne">
							<label class="BrandNew">品牌上新</label>
							<label class="Discount">折</label>
						</view>
						<view class="HomeTopRobbig">
							<label>每日九点，抢大牌</label>
						</view>
					</view>		
					<!-- <div> -->
					<view class="Cloth">
						<image  src="../../static/index/goods1.jpg" alt="">
					</view>
					
					<!-- </div> -->				
				</view>
				<!-- 右侧底部 -->
				<view class="HotBottom">
					<view class="HotBottomLeft">
						<view class="HotBottomLeftInfo">
							<label class="HotBottomLeftInfoTitle">每日十件</label>
							<label class="HotBottomLeftInfoDetail">只为你选好货</label>
						</view>
						<view class="HotBottomLeftImage">
							<image src="../../static/index/goods1.jpg" mode=""></image>
						</view>
					</view>
					<view class="HotBottomRight">
						<view class="HotBottomRightInfo">
							<label class="HotBottomRightInfoTitle">每日十件</label>
							<label class="HotBottomRightInfoDetail">只为你选好货</label>
						</view>
						<view class="HotBottomRightImage">
							<image src="../../static/index/goods1.jpg" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		  <!-- 轮播图2 -->
		<div class="Swiper2">
		  <image class="Swiper2Img" src="../../static/index/swiper1.jpg" alt />
		</div>
		
		<!-- 底部商品列表 -->
		<view class="products">
			<!-- 商品标签 -->
			<view class="tags">
				<view :class="active2==0?'tag_list active_tag_list':'tag_list'" @click="choose" :id='0'>
					<label for="">热门推荐</label>
				</view>
				<view :class="active2==1?'tag_list active_tag_list':'tag_list'" @click="choose" :id='1'>
					<label for="">发现专场</label>
				</view>
				<view :class="active2==2?'tag_list active_tag_list':'tag_list'" @click="choose" :id='2'>
					<label for="">全部好货</label>
				</view>
			
			</view>
			<!-- 标签对应的商品 -->
			<view class="tags_product">
				<view class="product" v-for="item in hotList" :key='item.id' @click="toDetail" :id ='item.id'>
					<view class="GoodsLeft">
						<image class="GoodsImg" :src="baseUrl+item.img" alt />
					</view>
					<view class="GoodsCont">
						<view class="GoodConTit">{{item.goodsname}}</view>
						<view class="GoodsPrice">￥{{item.price}}</view>
						<view class="yimai">原价:{{item.market_price}}</view>
						<view class="Immed">立即抢购</view>
					</view>
				</view>
		
				
			</view>
		</view>
	</view>
</template>

<script>
	// myRequest
	import {myRequest,baseUrl,getTime} from '@/utils/tool'
	export default{
		data(){
			return {
				bannerList:[],
				firstList:[],
				active:-1,
				active2:0,
				time:'',
				hotList:[],
				baseUrl:baseUrl
			}
		},
		async mounted(){
			// 请求获取轮播图数据
			var banner =await myRequest('/api/getbanner')
			this.bannerList = banner.list
			this.bannerList.forEach(item=>{
				item.img=baseUrl+item.img
			})
			//一级分类
			var first = await myRequest('/api/getcate')
			this.firstList = first.list
			// 秒杀
			this.getT()
			//热门推荐
			this.choose()
		},
		methods:{
			//选项卡
			toFirst(e){
				this.active = e.currentTarget.dataset.current
				//去列表
				uni.navigateTo({
					url:'../product/product?id='+e.currentTarget.id
				})
			},
			//倒计时
			async getT(){
				var seckill = await myRequest('/api/getseckill')
				this.time = getTime(seckill)
				setInterval(()=>{
					this.time = getTime(seckill)
				},1000)
			},
			//推荐选项卡
			async choose(e){
				if(e){
					this.active2 = e.currentTarget.id
				}			
				//热门推荐
				var res = await myRequest('/api/getindexgoods')
				this.hotList = res.list[this.active2].content
			},
			//去分类
			toSort(){
				uni.navigateTo({
					url:'../classify/classify'
				})
			},
			//去详情
			toDetail(e){
				uni.navigateTo({
					url:'../details/details?id='+e.currentTarget.id
				})
			},
			//去列表页
			toList(e){
				uni.navigateTo({
					url:'../product/product?id='+e.currentTarget.id
				})
			}
		}	
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/index.css");
</style>
