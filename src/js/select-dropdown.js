const selectContainers = Array.from(document.querySelectorAll(".select-container"))
let openContainer = null;

selectContainers.forEach(container => {
    const selectInput = container.querySelector(":scope > .select-element-input");
    selectInput.setAttribute("tabindex", "-1")
    const selectButton = container.querySelector(":scope > .select-element");
    const selectDropdown = container.querySelector(":scope > .select-dropdown");
    const selectOptions = Array.from(selectDropdown.querySelectorAll(":scope > .select-option"));

    const observer = new ResizeObserver(() => {
        selectDropdown.style.width = `${container.getBoundingClientRect().width}px`
    });

    observer.observe(selectDropdown)

    const isOpenedProxy = new Proxy({ value: false }, {
        set(target, p, value) {
            if (p !== "value") return false;
            target.value = value;

            if (target.value) {
                selectOptions.forEach(option => {
                    option.setAttribute("tabindex", "0")
                })
                container.classList.add("opened")

                openContainer = container
            } else {
                selectOptions.forEach(option => {
                    option.setAttribute("tabindex", "-1")
                })
                container.classList.remove("opened")

                if (openContainer == container) openContainer = null
            }

            positionDropdownWithinDropdown(container)
            return true
        }
    });
    isOpenedProxy.value = false;

    const valueProxy = new Proxy({ value: '' }, {
        set(target, p, value) {
            if (p !== "value") return false;

            const prevValue = target.value;

            target.value = value;
            selectInput.value = target.value || ""

            if (target.value) {
                let option = null;
                let prevOption = null;


                selectOptions.forEach(el => {
                    if (el.getAttribute("value") == String(target.value)) option = el;
                    if (el.getAttribute("value") == String(prevValue)) prevOption = el;
                });

                if (prevOption) {
                    prevOption.classList.remove("selected")
                }

                if (option) {
                    selectButton.textContent = option.textContent
                    option.classList.add("selected")
                    return true
                }
            }

            selectButton.textContent = selectInput.getAttribute("placeholder") || ""
            return true;
        }
    });
    valueProxy.value = selectInput.value || ""

    selectButton.addEventListener("click", () => {
        isOpenedProxy.value = !isOpenedProxy.value
    });

    selectOptions.forEach(option => {
        option.setAttribute("tabindex", "-1");

        option.addEventListener("click", () => {
            valueProxy.value = option.getAttribute("value") || "";
            isOpenedProxy.value = false
        })
    });

    container.addEventListener("triggerclose", (event) => {
        isOpenedProxy.value = false;
    });
    
    positionDropdownWithinDropdown(container)
});

window.addEventListener("click", event => {
    const path = event.composedPath();
    if(path.some(el => el instanceof Element && el.matches(".select-container.opened"))) return;
    const containers = Array.from(document.querySelectorAll(".select-container.opened"))
    containers.forEach(container => container.dispatchEvent(new Event("triggerclose")))
}, {
    passive: true,
    capture: true,
});

window.addEventListener("scroll", () => {
    if (openContainer) positionDropdownWithinDropdown(openContainer)
}, { passive: true })

function positionDropdownWithinDropdown(container) {
    const selectDropdown = container.querySelector(":scope > .select-dropdown");
    const boundingRect = container.getBoundingClientRect();

    selectDropdown.style.left = `${boundingRect.left}px`;
    selectDropdown.style.top = `${boundingRect.bottom + 4}px`
}