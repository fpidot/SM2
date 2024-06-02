const supabase = require('./src/database'); // Ensure correct path to database configuration

async function updateMoneyField() {
  try {
    const userId = 4;
    const amountToAdd = 1.0;

    // Fetch current money value
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('money')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError.message);
      return;
    }

    const currentMoney = parseFloat(userData.money);
    const newMoney = currentMoney + amountToAdd;

    console.log(`Current money: ${currentMoney}, New money: ${newMoney}`);
    console.log('Data type of currentMoney:', typeof currentMoney);
    console.log('Data type of newMoney:', typeof newMoney);

    // Directly log the current state before the update
    console.log('User data before update:', userData);

    // Update money field
    const { data, error, status, statusText } = await supabase
      .from('users')
      .update({ money: newMoney })
      .eq('id', userId)
      .select();

    // Log Supabase response
    console.log('Supabase update response status:', status);
    console.log('Supabase update response statusText:', statusText);
    console.log('Supabase update response data:', data);
    console.log('Supabase update response error:', error);

    if (error) {
      console.error('Supabase error:', error.message);
      return;
    }

    // Fetch the user data again to verify the update
    const { data: updatedUserData, error: updatedUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('User data after update:', updatedUserData);

  } catch (error) {
    console.error('Error during update:', error.message);
  }
}

updateMoneyField();
