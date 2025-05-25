import TailwindColors from "tailwindcss/colors";

const DarkColors = Object.values(TailwindColors)
  .filter((e) => typeof e === "object")
  .map((values) => values[950]);

export const generateDefaultAvatar = (nickname: string) => {
  if (nickname.length === 0) {
    throw new Error("Argument nickname must not be an empty string");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  const backgroundColor =
    DarkColors[Math.floor(Math.random() * DarkColors.length)];

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = "bold 100px Arial";
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillText(nickname.at(0)!, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
};

export const generateDataUrlFromFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
