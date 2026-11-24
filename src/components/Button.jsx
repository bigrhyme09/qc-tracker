export default function Button({ handleClick, text, variant = "default" }) {
  const className = variant === "reset" ? "btn btn-reset" : "btn";

  return (
    <button onClick={handleClick} className={className}>
      {text}
    </button>
  );
}