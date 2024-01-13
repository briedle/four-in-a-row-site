const myImage = document.querySelector("img");

myImage.onclick = () => {
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/four-in-a-row.jpg") {
    myImage.setAttribute("src", "images/giant-four-in-a-row.jpg");
  } else {
    myImage.setAttribute("src", "images/four-in-a-row.jpg");
  }
};

let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

function setUserName() {
    const myName = prompt("Please enter your name.");
    if (!myName) {
        setUserName();
    } else {
        localStorage.setItem("name", myName);
        myHeading.textContent = `Four-in-a-Row is really fun, ${myName}!`;
    }
}
  
  if (!localStorage.getItem("name")) {
    setUserName();
  } else {
    const storedName = localStorage.getItem("name");
    myHeading.textContent = `Four-in-a-Row is really fun, ${storedName}!`;
  }
  

  myButton.onclick = () => {
    setUserName();
  };
  