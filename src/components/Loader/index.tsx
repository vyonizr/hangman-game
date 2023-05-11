import './style.css'

function Loader({ className }: { className?: string }) {
  return <div className={`loader ${className ? className : ''}`} />
}

export default Loader
