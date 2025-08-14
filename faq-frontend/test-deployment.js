// 部署验证测试脚本
// 在浏览器控制台中运行这个脚本

console.log('🚀 开始测试部署状态...');

// 测试前端
console.log('\n📱 测试前端部署...');
console.log('前端URL:', window.location.href);
console.log('前端状态:', document.readyState);

// 测试后端API
console.log('\n🔧 测试后端API...');

// 测试FAQ API
fetch('https://faq-ai-system-backend.azurewebsites.net/api/faqs')
  .then(response => {
    console.log('✅ FAQ API 响应状态:', response.status);
    console.log('✅ FAQ API 响应头:', response.headers);
    return response.json();
  })
  .then(data => {
    console.log('✅ FAQ API 数据:', data);
  })
  .catch(error => {
    console.error('❌ FAQ API 错误:', error);
  });

// 测试后端健康状态
fetch('https://faq-ai-system-backend.azurewebsites.net/')
  .then(response => {
    console.log('✅ 后端根路径响应状态:', response.status);
  })
  .catch(error => {
    console.error('❌ 后端根路径错误:', error);
  });

// 测试环境变量
console.log('\n🔧 检查环境变量...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('当前域名:', window.location.hostname);

// 测试前端配置
console.log('\n⚙️ 检查前端配置...');
console.log('API配置:', window.location.href.includes('azurestaticapps.net') ? '生产环境' : '开发环境');

console.log('\n�� 测试完成！请查看上面的结果。');

