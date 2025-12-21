#!/usr/bin/env python3
"""
Image Optimization Script for Pokemon Classifier
Automatically resizes and optimizes the logo images
"""

import os
from pathlib import Path

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Warning: PIL/Pillow not installed. Install with: pip install Pillow")

def optimize_logo():
    """Resize and optimize the Pokemon logo for different display sizes"""
    
    if not PIL_AVAILABLE:
        print("\n❌ Cannot optimize images - PIL/Pillow not installed")
        print("Install it with: pip install Pillow")
        print("Or follow the manual optimization guide in IMAGE_OPTIMIZATION_GUIDE.md")
        return False
    
    logo_dir = Path("images/logo")
    original_logo = logo_dir / "pokeball_logo.png"
    
    if not original_logo.exists():
        print(f"❌ Original logo not found: {original_logo}")
        return False
    
    print(f"📂 Opening {original_logo}...")
    img = Image.open(original_logo)
    
    # Define target sizes
    sizes = {
        32: "pokeball_logo_32.png",  # Nav 1x
        48: "pokeball_logo_48.png",  # Header 1x
        64: "pokeball_logo_64.png",  # Nav 2x
        96: "pokeball_logo_96.png",  # Header 2x
    }
    
    print(f"\n🖼️  Original size: {img.size[0]}×{img.size[1]} ({original_logo.stat().st_size / 1024:.2f} KB)")
    print("\n🔄 Creating optimized versions...")
    
    total_saved = 0
    original_size = original_logo.stat().st_size
    
    for size, filename in sizes.items():
        output_path = logo_dir / filename
        
        # Resize using high-quality Lanczos resampling
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save with optimization
        resized.save(output_path, "PNG", optimize=True, quality=95)
        
        new_size = output_path.stat().st_size
        savings = original_size - new_size
        total_saved += savings
        
        print(f"  ✅ {filename}: {size}×{size} ({new_size / 1024:.2f} KB) - Saved {savings / 1024:.2f} KB")
    
    print(f"\n✨ Optimization complete!")
    print(f"💾 Total savings: {total_saved / 1024:.2f} KB ({(total_saved / original_size * 100):.1f}% reduction)")
    print(f"\n📊 Impact: Each page load will save ~{total_saved / 1024:.2f} KB")
    
    return True

def verify_optimization():
    """Verify that optimized images exist and show their sizes"""
    logo_dir = Path("images/logo")
    
    files = [
        "pokeball_logo.png",
        "pokeball_logo_32.png",
        "pokeball_logo_48.png",
        "pokeball_logo_64.png",
        "pokeball_logo_96.png",
    ]
    
    print("\n📋 Image Files Status:")
    print("-" * 60)
    
    all_exist = True
    for filename in files:
        filepath = logo_dir / filename
        if filepath.exists():
            size_kb = filepath.stat().st_size / 1024
            status = "✅" if size_kb < 10 or filename == "pokeball_logo.png" else "⚠️"
            print(f"{status} {filename:30s} {size_kb:>8.2f} KB")
        else:
            print(f"❌ {filename:30s} Missing")
            all_exist = False
    
    print("-" * 60)
    
    return all_exist

if __name__ == "__main__":
    print("🎨 Pokemon Classifier - Image Optimization Tool")
    print("=" * 60)
    
    # Check current status
    verify_optimization()
    
    # Optimize images
    print("\n")
    if optimize_logo():
        print("\n🎉 Success! Re-run Lighthouse to see performance improvements.")
    else:
        print("\n📖 Please follow IMAGE_OPTIMIZATION_GUIDE.md for manual optimization.")
    
    # Verify again
    print("\n")
    if verify_optimization():
        print("\n✅ All optimized images are ready!")
    else:
        print("\n⚠️  Some images are missing. Run this script to generate them.")
