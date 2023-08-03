const selectContainers = Array.from(document.querySelectorAll(".select-container"))

selectContainers.forEach(container => {
    const selectInput = container.querySelector(":scope > .select-element-input")
    const selectButton = container.querySelector(":scope > .select-element");
    const selectDropdown = container.querySelector(":scope > .select-dropdown");

    selectButton.addEventListener("click", () => {
        console.log(selectButton)
    })
})