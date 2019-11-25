// 生成唯一ID
export const uuid = ( len = 16 )=>{
  const chars = 'ABCDEFGHJKMNPQRSTWXYZ'.split('')
  return new Array(len).fill(0).reduce((ret, _, index)=>{
    const char = chars[Math.floor(Math.random() * chars.length)];
    if( len/2 === index+1 ) return ret.concat(char, '-')
    return ret.concat(char)
  }, []).join('')
}

// 报错或者警告
export const invariant = ( message: string, print = console.warn)=>{
  return (err: any)=> {
    err && print('Dialog: '+ message)
    return null
  }
}

// defer 对象
export const defer = () => {
	let deferred: any ={};
	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
};