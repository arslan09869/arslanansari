document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    smooth: true,
    lerp: 0.1, // Adjust smoothness
    duration: 1.2, // optional
  });

  // GSAP ticker connects to Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP lag smoothing (required for Lenis)
  gsap.ticker.lagSmoothing(0);
  gsap.registerPlugin(ScrollTrigger);

  CustomEase.create(
    "hop",
    "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1"
  );

  CustomEase.create(
    "hop2",
    "M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1"
  );
  const splitH2 = new SplitType(".site-info h2", {
    types: "lines",
  });

  splitH2.lines.forEach((line) => {
    const text = line.textContent;
    const wrapper = document.createElement("div");
    wrapper.className = "line";
    const span = document.createElement("span");
    span.textContent = text;
    wrapper.appendChild(span);
    line.parentNode.replaceChild(wrapper, line);
  });

  const splitAbout = new SplitType(".about-heading", {
    types: "lines",
  });

  splitAbout.lines.forEach((line) => {
    const text = line.textContent;
    const wrapper = document.createElement("div");
    wrapper.className = "line";
    const span = document.createElement("span");
    span.textContent = text;
    wrapper.appendChild(span);
    line.parentNode.replaceChild(wrapper, line);
  });

  // About section scroll animation
  gsap.to(".about-heading .line span", {
    y: 0,
    duration: 1.5,
    ease: "hop2",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".about",
      start: "top 20%",
      end: "top 30%",
      // markers: true,
      toggleActions: "play none none none",
    },
  });
  // About image scroll animation
  gsap.fromTo(
    ".about-img img",
    {
      scale: 1.2,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about",
        start: "top 20%",
        end: "top 30%",
        toggleActions: "play none none none",
      },
    }
  );

  const mainTl = gsap.timeline();
  const revealerTl = gsap.timeline();
  const scaleTl = gsap.timeline();

  revealerTl
    .to(".r-1", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.5,
      ease: "hop",
    })
    .to(
      ".r-2",
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
      },
      "<"
    );

  scaleTl.to(".img:first-child", {
    scale: 1,
    duration: 2,
    ease: "power4.inOut",
  });

  const images = document.querySelectorAll(".img:not(:first-child)");

  images.forEach((img, index) => {
    scaleTl.to(
      img,
      {
        opacity: 1,
        scale: 1,
        duration: 1.25,
        ease: "power3.out",
      },
      ">-0.5"
    );
  });

  mainTl
    .add(revealerTl)
    .add(scaleTl, "-=1.25")
    .add(() => {
      document
        .querySelectorAll(".img:not(.main)")
        .forEach((img) => img.remove());

      const state = Flip.getState(".main");

      const imagesContainer = document.querySelector(".images");
      imagesContainer.classList.add("stacked-container");
      document.querySelectorAll(".main").forEach((img, i) => {
        img.classList.add("stacked");
        img.style.order = i;

        gsap.set(".img.stacked", {
          clearProps: "transform, top, left",
        });
      });

      return Flip.from(state, {
        duration: 2,
        ease: "hop",
        absolute: true,
        stagger: {
          amount: -0.3,
        },
      });
    })
    .to(".word h1, .nav-item p, .line p, .site-info h2, .line span", {
      y: 0,
      duration: 3,
      ease: "hop2",
      stagger: 0.1,
      delay: 1.25,
    })
    .set(".cover-img", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    })
    .set(".after", {
      display: "block",
    });

  // skills js

  const container = document.getElementById("skills-container");
  const highlight = document.getElementById("highlight");
  if (!container || !highlight) return;

  const gridItems = container.querySelectorAll(".grid-item");
  const firstItem = container.querySelector(".grid-item");

  const highlightColors = [
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
  ];

  gridItems.forEach((item, index) => {
    item.dataset.color = highlightColors[index % highlightColors.length];
  });

  const moveToElement = (element) => {
    if (!element) return;

    // Remove active class from all
    gridItems.forEach((i) => i.classList.remove("active"));

    // Add active class to the hovered one
    element.classList.add("active");

    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;

    highlight.style.transform = `translate(${x}px, ${y}px)`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.backgroundColor = element.dataset.color;
  };

  const moveHighlight = (e) => {
    const hovered = document.elementFromPoint(e.clientX, e.clientY);

    if (!hovered) return;

    if (hovered.classList.contains("grid-item")) {
      moveToElement(hovered);
    } else if (hovered.parentElement?.classList.contains("grid-item")) {
      moveToElement(hovered.parentElement);
    }
  };

  // Initialize highlight on the first item
  if (firstItem) moveToElement(firstItem);

  container.addEventListener("mousemove", moveHighlight);

  // end skills anim

  // Select all .letter elements
  document.querySelectorAll(".roww").forEach((row) => {
    const letters = row.querySelectorAll(".letter");

    gsap.fromTo(
      letters,
      {
        y: "140%",
      },
      {
        y: "0%",
        opacity: 1,
        // filter: "blur(0px)",
        // ease: "expo.out",
        duration: 1.6,
        stagger: {
          each: 0.06,
          from: "random",
        },
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          end: "top 30%",
          scrub: 1.5,
        },
      }
    );
  });

  document.querySelectorAll(".work-card").forEach((card) => {
    const video = card.querySelector(".preview-video");
    if (video) {
      card.addEventListener("mouseenter", () => {
        video.play();
      });
      card.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });
});
