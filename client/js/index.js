function blinkRed(input, msg) {
  var count = 0;
  msg.innerText = input;
  var intervalId = setInterval(function () {
    if (count % 2 === 0) {
      msg.style.color = "red";
      msg.style.fontSize = "18px";
    } else {
      msg.style.color = "";
      msg.style.fontSize = "";
    }

    count++;

    if (count === 10) {
      clearInterval(intervalId);
      return;
    }
  }, 500);
}

document.getElementById("submit").addEventListener("click", function (event) {
  var h1Element = document.querySelector("h1");
  var message = document.getElementById("msg");
  var mailadresValue = document.getElementById("mailadres").value;
  var usernameValue = document.getElementById("username").value;
  var passwordValue = document.getElementById("password").value;

  var repasswordValue = document.getElementById("repassword").value;

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (h1Element.innerText === "Sign In") {
    if (usernameValue !== "" && passwordValue !== "") {
      fetch("http://localhost:5000/search/" + usernameValue).then(
        (response) => {
          response.json();
          console.log(response.body);
        }
      );
    }
  } else {
    if (
      mailadresValue !== "" &&
      usernameValue !== "" &&
      passwordValue !== "" &&
      repasswordValue !== ""
    ) {
      if (!emailRegex.test(mailadresValue)) {
        blinkRed("Invalid E-Mail", message);
        return;
      }
      if (!passwordValue === repasswordValue) {
        blinkRed("Password don't match", message);
        return;
      }
      fetch("http://localhost:5000/search/" + usernameValue)
        .then((response) => response.json())
        .then((data) => {
          var fetched = data["data"][0];

          if (data["data"].length > 0) {
            if (fetched.userMail === mailadresValue) {
              blinkRed("Duplicate mail", message);
            } else {
              blinkRed("Duplicate user", message);
            }
            console.log("stop");
            return;
          } else {
            fetch("http://localhost:5000/insert", {
              headers: {
                "Content-type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                userMail: mailadresValue,
                userName: usernameValue,
                userPassword: passwordValue,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                toggleMenu();
              });
          }
        });
    }
  }
});
