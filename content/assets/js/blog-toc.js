// Blog TOC: active heading tracking + mobile toggle
(function () {
  // Active heading tracking via IntersectionObserver
  const tocLinks = document.querySelectorAll(".blog-toc .toc-nav a, .blog-toc-mobile .toc-nav a");
  if (!tocLinks.length) return;

  const headingIds = Array.from(tocLinks).map((a) => a.getAttribute("href")?.replace("#", "")).filter(Boolean);
  const headings = headingIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (!headings.length) return;

  let current = headingIds[0];

  function setActive(id) {
    if (id === current) return;
    current = id;
    tocLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // Find the topmost visible heading
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0,
    }
  );

  headings.forEach((h) => observer.observe(h));

  // Mobile TOC toggle
  const toggleBtn = document.querySelector(".blog-toc-toggle");
  const mobilePanel = document.querySelector(".blog-toc-mobile");

  if (toggleBtn && mobilePanel) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = mobilePanel.hidden;
      mobilePanel.hidden = !isHidden;
      toggleBtn.setAttribute("aria-expanded", String(isHidden));
    });

    // Close when a link is clicked
    mobilePanel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobilePanel.hidden = true;
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!mobilePanel.hidden && !mobilePanel.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobilePanel.hidden = true;
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
