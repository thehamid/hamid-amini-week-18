const Header = ({addContact}) => {
  return (
     <header className="app-header">
        <h1> &#x2756;   کانتکت پلاس   <span>(ver(3):yup&formik)</span></h1>
        <button onClick={addContact} className="btn btn-primary">
          افزودن مخاطب &#x2719;
        </button>
      </header>
  )
}

export default Header