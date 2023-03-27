        var time = 0
        function setTime(e){
            time = parseInt(e.target.value)
            console.log(time)
        }

        let buttons = document.querySelectorAll("button")

        buttons.forEach((boton) => {
            boton.addEventListener("click", setTime)
        })
