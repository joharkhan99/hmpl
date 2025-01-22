document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("search-box");
  const resultsList = document.getElementById("results");

  fetch("/search.json")
    .then((response) => response.json())
    .then((data) => {
      const searchIndex = lunr(function () {
        this.ref("url");
        this.field("title");
        this.field("content");

        data.forEach((doc) => this.add(doc));
      });

      searchBox.addEventListener("input", function () {
        const query = this.value;
        const results = searchIndex.search(query);

        resultsList.innerHTML = results
          .map((result) => {
            const item = data.find((d) => d.url === result.ref);
            return `<li><a href="${item.url}">${item.title}</a></li>`;
          })
          .join("");
      });
    });
});
