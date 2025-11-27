import argparse
import os
from PIL import Image

def convert_white_to_alpha(input_path, output_path=None, threshold=0):
    """
    Loads an image, resizes it to 4961x2239, converts white pixels to transparent, and saves it.
    
    Args:
        input_path (str): Path to the input image.
        output_path (str): Path to save the result.
        threshold (int): Tolerance for "white" (0-255). 
    """
    try:
        # 1. Open image and ensure it has an Alpha channel (RGBA)
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        # --- NOWA SEKCJA: SKALOWANIE ---
        target_width = 4961
        target_height = 2239
        print(f"Resizing image to {target_width}x{target_height}...")
        
        # Używamy Image.Resampling.LANCZOS dla najlepszej jakości
        # (W starszych wersjach Pillow zamiast Image.Resampling.LANCZOS użyj Image.LANCZOS)
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        # -------------------------------

        datas = img.getdata()
        
        newData = []
        
        # 2. Define the limit for what is considered "white"
        cut_off = 255 - threshold
        
        print(f"Processing pixels with threshold {threshold} (this may take a moment for large images)...")

        # 3. Iterate through pixels
        for item in datas:
            # item is a tuple (R, G, B, A)
            if item[0] >= cut_off and item[1] >= cut_off and item[2] >= cut_off:
                # Replace with transparent
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        
        # 4. Update image data
        img.putdata(newData)
        
        # 5. Determine output path if not provided
        if not output_path:
            filename, ext = os.path.splitext(input_path)
            output_path = f"{filename}_4961x2239_transparent.png"
            
        img.save(output_path, "PNG")
        print(f"Success! Saved to: {output_path}")

    except FileNotFoundError:
        print(f"Error: The file '{input_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Resize to 4961x2239 and convert white to transparent.")
    parser.add_argument("input_file", help="Path to the input PNG image.")
    parser.add_argument("-o", "--output", help="Path to the output image (optional).")
    parser.add_argument("-t", "--threshold", type=int, default=0, help="Threshold 0-255 (default 0).")

    args = parser.parse_args()

    convert_white_to_alpha(args.input_file, args.output, args.threshold)