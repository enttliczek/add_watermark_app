import tkinter as tk
from tkinter import *
from tkinter import filedialog
from tkinter import Canvas
from PIL import Image, ImageDraw, ImageFont, ImageTk

original_photo = None



# Function to open the file
def open_file():
    global original_photo
    filepath = filedialog.askopenfilename()
    if filepath:
        print("Selected file:", filepath)
        original_photo = Image.open(filepath)
        original_photo.thumbnail((800, 526))
        photo_img = ImageTk.PhotoImage(original_photo)
        canvas.create_image(400, 263, image=photo_img)
        canvas.photo = photo_img
        return original_photo


# Function to make, and add the watermark to the uploaded picture
def add_watermark(original_photo):
    if original_photo:
        # Create a blank image which will be background for our watermark
        watermark = Image.new("RGBA", (200, 200), (255, 255, 255, 0))

        # Draw lines and text on watermark
        d = ImageDraw.Draw(watermark)
        d.line([(0, 100), (200, 100)], "gray", width=2)
        d.line([(100, 0), (200, 100)], "gray", width=2)
        font = ImageFont.truetype("arial.ttf", 24)
        d.text((10, 10), "Kamil Bentkowski", fill="black", font=font)

        # Overlay the watermark onto the original photo
        original_photo.paste(watermark, (0, 0), mask=watermark)

        # Display our picture with watermark
        photo_img = ImageTk.PhotoImage(original_photo)
        canvas.create_image(400, 263, image=photo_img)
        canvas.photo = photo_img


# ---------------------------- UI SETUP ------------------------------- #

window = Tk()
window.title("Image watermarking desktop app")
window.config(pady=50, padx=50)
canvas = Canvas(height=526, width=800)
canvas.pack()

# -- Buttons -- #
upload_button = tk.Button(window, text='Open file', command=open_file)
upload_button.pack()

watermark_button = tk.Button(window, text='Add watermark', command=lambda: add_watermark(original_photo))
watermark_button.pack()

window.mainloop()
