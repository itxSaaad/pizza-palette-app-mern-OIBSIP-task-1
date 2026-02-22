const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');
const Admin = require('../schemas/adminUserSchema');
const sendEmail = require('../middlewares/nodemailerMiddleware');

/**
 * Check for low inventory items below threshold
 * @returns {Promise<Object>} - Low stock items
 */
const checkLowInventory = async () => {
  const [bases, sauces, cheeses, veggies] = await Promise.all([
    Base.find({ $expr: { $lte: ['$quantity', '$threshold'] } }),
    Sauce.find({ $expr: { $lte: ['$quantity', '$threshold'] } }),
    Cheese.find({ $expr: { $lte: ['$quantity', '$threshold'] } }),
    Veggie.find({ $expr: { $lte: ['$quantity', '$threshold'] } })
  ]);

  return {
    bases: bases.map(item => ({
      item: item.item,
      quantity: item.quantity,
      threshold: item.threshold,
      deficit: item.threshold - item.quantity
    })),
    sauces: sauces.map(item => ({
      item: item.item,
      quantity: item.quantity,
      threshold: item.threshold,
      deficit: item.threshold - item.quantity
    })),
    cheeses: cheeses.map(item => ({
      item: item.item,
      quantity: item.quantity,
      threshold: item.threshold,
      deficit: item.threshold - item.quantity
    })),
    veggies: veggies.map(item => ({
      item: item.item,
      quantity: item.quantity,
      threshold: item.threshold,
      deficit: item.threshold - item.quantity
    })),
    totalLowStockItems: bases.length + sauces.length + cheeses.length + veggies.length
  };
};

/**
 * Send low inventory alert emails to all admins
 * @param {Object} lowStockData - Low stock inventory data
 * @returns {Promise<void>}
 */
const sendLowInventoryAlerts = async (lowStockData) => {
  if (lowStockData.totalLowStockItems === 0) {
    console.log('No low inventory items to alert about');
    return;
  }

  // Get all approved admins
  const admins = await Admin.find({ isApproved: true });

  if (admins.length === 0) {
    console.log('No approved admins to send alerts to');
    return;
  }

  // Build email body
  const buildItemsList = (items, title) => {
    if (items.length === 0) return '';
    
    return `
      <h3 style="color: #FF9800;">${title}</h3>
      <ul>
        ${items.map(item => `
          <li>
            <strong>${item.item}</strong>: ${item.quantity} units remaining 
            (threshold: ${item.threshold}, deficit: ${item.deficit})
          </li>
        `).join('')}
      </ul>
    `;
  };

  const emailBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #d32f2f;">⚠️ Low Inventory Alert</h2>
      <p>The following inventory items have fallen below their threshold levels and require immediate attention:</p>
      
      ${buildItemsList(lowStockData.bases, '🍞 Bases')}
      ${buildItemsList(lowStockData.sauces, '🍅 Sauces')}
      ${buildItemsList(lowStockData.cheeses, '🧀 Cheeses')}
      ${buildItemsList(lowStockData.veggies, '🥬 Veggies')}
      
      <p style="margin-top: 20px;">
        <strong>Total Items Below Threshold:</strong> ${lowStockData.totalLowStockItems}
      </p>
      
      <p style="margin-top: 20px; color: #666;">
        Please restock these items as soon as possible to avoid order disruptions.
      </p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        This is an automated alert from Pizza Palette Inventory Management System.
      </p>
    </div>
  `;

  // Send email to all admins
  const emailPromises = admins.map(admin => 
    sendEmail({
      to: admin.email,
      subject: '⚠️ Low Inventory Alert - Immediate Action Required',
      templateOptions: {
        title: 'Low Inventory Alert',
        greeting: `Hi ${admin.name},`,
        message: emailBody
      }
    }).catch(err => {
      console.error(`Failed to send alert to ${admin.email}:`, err.message);
    })
  );

  await Promise.all(emailPromises);
  console.log(`Low inventory alerts sent to ${admins.length} admin(s)`);
};

/**
 * Automated inventory check and alert (can be scheduled)
 * @returns {Promise<Object>} - Check result
 */
const runInventoryCheck = async () => {
  try {
    const lowStockData = await checkLowInventory();
    
    if (lowStockData.totalLowStockItems > 0) {
      await sendLowInventoryAlerts(lowStockData);
      return {
        success: true,
        alertsSent: true,
        lowStockData
      };
    }

    return {
      success: true,
      alertsSent: false,
      message: 'All inventory levels are above threshold'
    };
  } catch (error) {
    console.error('Inventory check failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  checkLowInventory,
  sendLowInventoryAlerts,
  runInventoryCheck
};
