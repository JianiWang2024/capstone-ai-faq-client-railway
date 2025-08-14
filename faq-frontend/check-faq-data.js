// FAQ数据完整性检查脚本
// 在浏览器控制台中运行这个脚本

console.log('🔍 开始检查FAQ数据完整性...');

// 检查1: 获取所有FAQ数据
fetch('https://faq-ai-system-backend.azurewebsites.net/api/faqs')
  .then(response => {
    console.log('✅ FAQ API响应状态:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('\n📊 FAQ数据统计:');
    console.log('总数量:', data.length);
    
    // 检查每个FAQ的完整性
    console.log('\n🔍 详细检查结果:');
    data.forEach((faq, index) => {
      const hasQuestion = faq.question && faq.question.trim() !== '';
      const hasAnswer = faq.answer && faq.answer.trim() !== '';
      const status = hasQuestion && hasAnswer ? '✅ 完整' : '❌ 不完整';
      
      console.log(`${index + 1}. ID: ${faq.id} - ${status}`);
      console.log(`   问题: "${faq.question}"`);
      console.log(`   答案: "${faq.answer}"`);
      console.log('   ---');
    });
    
    // 统计不完整的FAQ
    const incompleteFaqs = data.filter(faq => 
      !faq.question || !faq.answer || 
      faq.question.trim() === '' || 
      faq.answer.trim() === ''
    );
    
    console.log('\n📈 完整性统计:');
    console.log('完整FAQ:', data.length - incompleteFaqs.length);
    console.log('不完整FAQ:', incompleteFaqs.length);
    
    if (incompleteFaqs.length > 0) {
      console.log('\n⚠️ 需要修复的FAQ:');
      incompleteFaqs.forEach(faq => {
        console.log(`ID: ${faq.id} - 问题: "${faq.question}" - 答案: "${faq.answer}"`);
      });
    }
    
    return data;
  })
  .catch(error => {
    console.error('❌ 检查FAQ数据失败:', error);
  });

// 检查2: 测试AI服务
console.log('\n🤖 测试AI服务...');
const testQuestion = "How do I reset my password?";

fetch('https://faq-ai-system-backend.azurewebsites.net/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: testQuestion,
    session_id: 'test-session'
  })
})
.then(response => {
  console.log('✅ AI服务响应状态:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ AI服务响应:', data);
})
.catch(error => {
  console.error('❌ AI服务测试失败:', error);
});

console.log('\n�� 检查完成！请查看上面的结果。');
