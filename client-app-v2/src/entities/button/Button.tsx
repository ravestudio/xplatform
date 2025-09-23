import clsx from "clsx";
import css from "./Button.module.css";

type ButtonStyle = "default" | "green" | "red";

interface ButtonProps {
  text: string;
  style?: ButtonStyle;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Button = ({ text, style = "default", onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={clsx(css.button, css[style])}>
      {text}
    </button>
  );
};
