const supabase = require('./src/database'); // Ensure correct path to database configuration

async function testUpdate() {
  try {
    const userId = 4;
    const newMoney = 100;

    const { data, error, status, statusText } = await supabase
      .from('users')
      .update({ money: newMoney })
      .eq('id', userId)
      .select();

    console.log('Supabase update response status:', status);
    console.log('Supabase update response statusText:', statusText);
    console.log('Supabase update response data:', data);
    console.log('Supabase update response error:', error);

    if (error) {
      console.error('Supabase error:', error.message);
    } else {
      console.log('Update successful:', data);
    }
  } catch (error) {
    console.error('Error updating user information:', error.message);
  }
}

testUpdate();
