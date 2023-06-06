(function (module) {
  module.setGithubLinkCallbacks = function() {
    // Set the Github link to 'beat' when moused over.
    const githubLink = document.getElementById('minesweeper-github');
    githubLink.addEventListener('mouseenter', () => {
      githubLink.classList.add('fa-beat');
    });

    githubLink.addEventListener('mouseleave', () => {
      githubLink.classList.remove('fa-beat');
    });
  }

return module;
} (window.MINESWEEPER_MODULE = window.MINESWEEPER_MODULE || {}));