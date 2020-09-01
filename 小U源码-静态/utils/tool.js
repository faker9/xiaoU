const baseUrl='http://localhost:3000'

async function myRequest(url,data={},method='get',header={}){
	var res =  await uni.request({
		url:baseUrl+url,
		data,
		method,
		header
	})
	return res[1].data
}
//倒计时获取
function getTime(seckill){
	var time = Math.floor((seckill.list[0].endtime -new Date().getTime())/1000)
	var s = String((time%60)).padStart(2,'0')
	var m = (Math.floor(time/60%60)+'').padStart(2,'0')
	var h = (Math.floor(time/60/60)+'').padStart(2,'0')
	return [h,m,s]
}

export {myRequest,baseUrl,getTime}