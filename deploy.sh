#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 Files ready for deployment in ./dist/"
    echo ""
    echo "Next steps:"
    echo "1. Go to GitHub repository: https://github.com/tfarzalo/dare-skip"
    echo "2. Navigate to Settings → Pages"
    echo "3. Enable GitHub Pages with source: Deploy from a branch"
    echo "4. Select main branch and / (root) folder"
    echo "5. Wait for deployment to complete"
    echo ""
    echo "🌐 Your site will be available at: https://tfarzalo.github.io/dare-skip"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi