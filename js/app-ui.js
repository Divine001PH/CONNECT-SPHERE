(function () {
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const searchableSelector = [
    '.post-card',
    '.community-card',
    '.resource-item',
    '.event-card',
    '.confession-card',
    '.conversation-item',
    '.friend-card',
    '.resource-card'
  ].join(',');

  function ensureToastRegion() {
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    return region;
  }

  function toast(message) {
    const region = ensureToastRegion();
    const item = document.createElement('div');
    item.className = 'toast';
    item.textContent = message;
    region.appendChild(item);

    requestAnimationFrame(() => item.classList.add('show'));
    window.setTimeout(() => {
      item.classList.remove('show');
      item.addEventListener('transitionend', () => item.remove(), { once: true });
    }, 2600);
  }

  function markCurrentNav() {
    document.querySelectorAll('.nav-item[href], .mobile-nav-item[href]').forEach((link) => {
      const href = link.getAttribute('href').split('#')[0].toLowerCase();
      if (href === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function setupMobileSidebar() {
    const navInner = document.querySelector('.top-nav-inner');
    const sidebar = document.querySelector('.sidebar-left');
    if (!navInner || !sidebar || document.querySelector('.mobile-menu-btn')) return;

    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.id = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    const button = document.createElement('button');
    button.className = 'mobile-menu-btn';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open navigation');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span></span><span></span><span></span>';
    navInner.insertBefore(button, navInner.firstChild);

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation');
    };

    const openSidebar = () => {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      button.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Close navigation');
    };

    button.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);
    sidebar.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeSidebar();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeSidebar();
    });
  }

  function setupSearch() {
    document.querySelectorAll('.search-bar input, .conversations-search input').forEach((input) => {
      const scope = input.closest('.conversations-panel') || document.querySelector('main') || document;
      const items = Array.from(scope.querySelectorAll(searchableSelector));
      if (!items.length) return;

      input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        items.forEach((item) => {
          const matches = !query || item.textContent.toLowerCase().includes(query);
          item.classList.toggle('is-hidden-by-search', !matches);
        });
      });
    });
  }

  function incrementButtonCount(button) {
    if (button.dataset.voted === 'true') return;
    button.dataset.voted = 'true';

    const text = button.textContent;
    const countMatch = text.match(/(\d+)(?!.*\d)/);
    if (!countMatch) return;

    const next = Number(countMatch[1]) + 1;
    button.textContent = text.replace(/(\d+)(?!.*\d)/, String(next));
  }

  function setupFeedbackActions() {
    document.addEventListener('click', (event) => {
      const saveButton = event.target.closest('.save-btn');
      if (saveButton) {
        saveButton.classList.toggle('is-active');
        saveButton.setAttribute('aria-pressed', saveButton.classList.contains('is-active'));
        toast(saveButton.classList.contains('is-active') ? 'Saved to your library' : 'Removed from saved items');
        return;
      }

      const joinButton = event.target.closest('.btn-join, .community-btn');
      if (joinButton && joinButton.textContent.trim().toLowerCase() === 'join') {
        joinButton.classList.add('is-active');
        joinButton.textContent = 'Joined';
        joinButton.setAttribute('aria-pressed', 'true');
        toast('Community joined');
        return;
      }

      const downloadButton = event.target.closest('.resource-dl-btn');
      if (downloadButton) {
        toast('Download started');
        return;
      }

      const reactionButton = event.target.closest('.reaction-btn');
      if (reactionButton) {
        const label = reactionButton.textContent.toLowerCase();
        if (label.includes('comment')) {
          toast('Comments will open here in the next build');
          return;
        }
        if (label.includes('share')) {
          toast('Post shared');
          return;
        }
        if (label.includes('save')) {
          reactionButton.classList.toggle('is-active');
          toast(reactionButton.classList.contains('is-active') ? 'Post saved' : 'Post unsaved');
          return;
        }
        reactionButton.classList.add('is-active');
        reactionButton.setAttribute('aria-pressed', 'true');
        incrementButtonCount(reactionButton);
      }
    });

    const uploadShortcut = document.querySelector('.upload-btn-sm');
    const uploadTrigger = document.getElementById('upload-btn');
    if (uploadShortcut && uploadTrigger) {
      uploadShortcut.addEventListener('click', () => uploadTrigger.click());
    }
  }

  function setupModalEscape() {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach((modal) => {
        modal.classList.add('hidden');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    markCurrentNav();
    setupMobileSidebar();
    setupSearch();
    setupFeedbackActions();
    setupModalEscape();
  });
})();
