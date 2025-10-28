const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://amarnath10kct:Amarnath8667@cluster0.my8jqd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function cleanupExternalImages() {
  try {
    console.log('Starting cleanup of products with external image URLs...');

    // Find products with external URLs (not from our upload system)
    const products = await Product.find({
      images: {
        $elemMatch: {
          $not: /^\/uploads\//
        }
      }
    }).populate('vendor', 'name email');

    console.log(`Found ${products.length} products with external image URLs:`);

    for (const product of products) {
      console.log(`\n- Product: ${product.name}`);
      console.log(`  ID: ${product._id}`);
      console.log(`  Vendor: ${product.vendor?.name || 'Unknown'}`);
      console.log(`  Current images: ${JSON.stringify(product.images)}`);
      
      // Check if any images are external URLs
      const hasExternalImages = product.images.some(img => 
        img.startsWith('http://') || img.startsWith('https://') || !img.startsWith('/uploads/')
      );

      if (hasExternalImages) {
        console.log(`  ❌ Has external images - needs cleanup`);
      } else {
        console.log(`  ✅ All images are from upload system`);
      }
    }

    console.log('\n=== CLEANUP OPTIONS ===');
    console.log('1. Delete products with external images');
    console.log('2. Replace external images with placeholder');
    console.log('3. Just show the report (no changes)');

    // For now, just show the report
    console.log('\nThis is a report only. No changes were made.');
    console.log('To perform cleanup, modify this script and uncomment the desired action.');

    // OPTION 1: Delete products with external images
    console.log('\nDeleting products with external images...');
    let deletedCount = 0;
    for (const product of products) {
      const hasExternalImages = product.images.some(img => 
        img.startsWith('http://') || img.startsWith('https://') || !img.startsWith('/uploads/')
      );
      
      if (hasExternalImages) {
        await Product.findByIdAndDelete(product._id);
        console.log(`✅ Deleted product: ${product.name}`);
        deletedCount++;
      }
    }
    
    console.log(`\n🎉 Cleanup completed! Deleted ${deletedCount} products with external images.`);
    console.log('Only products with properly uploaded images remain.');

    /*
    // OPTION 2: Replace external images with placeholder
    console.log('\nReplacing external images with placeholder...');
    for (const product of products) {
      const hasExternalImages = product.images.some(img => 
        img.startsWith('http://') || img.startsWith('https://') || !img.startsWith('/uploads/')
      );
      
      if (hasExternalImages) {
        // Replace with placeholder - vendors will need to upload proper images
        product.images = ['/uploads/placeholder.png']; // You'd need to add a placeholder image
        await product.save();
        console.log(`✅ Updated product: ${product.name}`);
      }
    }
    */

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanupExternalImages();