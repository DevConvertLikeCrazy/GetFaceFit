if (document.querySelector(".accordion__trigger")) {
    $(document).on("click", ".accordion__trigger", function (event) {
        event.preventDefault();

        let clickedItem = $(this).closest(".accordion__item");

        if (!clickedItem.hasClass("open")) {
            $(".accordion__item.open")
                .removeClass("open")
                .find(".accordion__content")
                .slideUp("fast");

            clickedItem.addClass("open");
            clickedItem.find(".accordion__content").slideDown("fast");
        } else {
            clickedItem.removeClass("open");
            clickedItem.find(".accordion__content").slideUp("fast");
        }
    });
}
