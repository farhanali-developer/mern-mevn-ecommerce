  export default function checkStorage() {
    var user = JSON.parse(localStorage.getItem("jwt"));
    console.log({user})
    if (user !== "") {
      return true;
    }
    else{
      return false;
    }
  }