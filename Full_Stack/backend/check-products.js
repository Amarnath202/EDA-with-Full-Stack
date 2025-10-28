const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://amarnath10kct:Amarnath8667@cluster0.my8jqd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkProducts() {
  try {
    console.log('Checking products in database...');

    // Count all products
    const totalProducts = await Product.countDocuments();
    console.log(`Total products in database: ${totalProducts}`);

    // Count active products
    const activeProducts = await Product.countDocuments({ isActive: true });
    console.log(`Active products: ${activeProducts}`);

    // Get all products with vendor info
    const products = await Product.find().populate('vendor', 'name email role').limit(10);
    
    console.log('\nProducts found:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Subcategory: ${product.subcategory}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Stock: ${product.stock} ${product.unit}`);
      console.log(`   Vendor: ${product.vendor?.name || 'Unknown'} (${product.vendor?.email || 'No email'})`);
      console.log(`   Active: ${product.isActive}`);
      console.log(`   Created: ${product.createdAt}`);
      console.log('   ---');
    });
    
    // Check vendors
    console.log('\nChecking vendors...');
    const vendors = await User.find({ role: 'vendor' });
    console.log(`Total vendors: ${vendors.length}`);
    vendors.forEach(vendor => {
      console.log(`- ${vendor.name} (${vendor.email})`);
    });
    
  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    mongoose.connection.close();
  }
}

async function removeTestProducts() {
  try {
    console.log('Removing test/sample products...');

    // Define patterns for test products to remove
    const testProductPatterns = [
      /^Sample/i,
      /^Test/i,
      /^Demo/i,
      /Fresh Orange Juice/i,
      /Premium Almonds/i
    ];

    // Find products matching test patterns
    const testProducts = await Product.find({
      $or: testProductPatterns.map(pattern => ({ name: pattern }))
    }).populate('vendor', 'name email');

    console.log(`Found ${testProducts.length} test products:`);
    testProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} - Vendor: ${product.vendor?.name || 'Unknown'}`);
    });

    if (testProducts.length > 0) {
      // Remove test products
      const result = await Product.deleteMany({
        $or: testProductPatterns.map(pattern => ({ name: pattern }))
      });

      console.log(`✅ Removed ${result.deletedCount} test products`);
    } else {
      console.log('No test products found to remove');
    }

  } catch (error) {
    console.error('Error removing test products:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--remove-test')) {
  removeTestProducts();
} else {
  checkProducts();
}
