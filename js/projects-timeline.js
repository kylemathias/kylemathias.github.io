(function () {
  let sortMode = 'highlights';

  const HIGHLIGHT_PROJECT_PRIORITY = [
    'component document maker',
    'ai translation process',
    'rainfocus data integrity dashboard',
    'sitescope',
    'ai attendee activity report',
    'ai vs human metadata',
    'bynder upload form'
  ];

  const HIGHLIGHT_PROJECT_TITLES = new Set(HIGHLIGHT_PROJECT_PRIORITY);
  const HIGHLIGHT_PRIORITY_INDEX = new Map(
    HIGHLIGHT_PROJECT_PRIORITY.map((title, index) => [title, index])
  );

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeTitle(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isHighlightedProject(project) {
    return HIGHLIGHT_PROJECT_TITLES.has(normalizeTitle(project.title));
  }

  function compareByDate(a, b, mode) {
    if (mode === 'updated') {
      if ((a.updatedYear || 0) !== (b.updatedYear || 0)) {
        return (b.updatedYear || 0) - (a.updatedYear || 0);
      }
      if ((a.startedYear || 0) !== (b.startedYear || 0)) {
        return (b.startedYear || 0) - (a.startedYear || 0);
      }
      return a.title.localeCompare(b.title);
    }

    if ((a.startedYear || 0) !== (b.startedYear || 0)) {
      return (b.startedYear || 0) - (a.startedYear || 0);
    }
    if ((a.updatedYear || 0) !== (b.updatedYear || 0)) {
      return (b.updatedYear || 0) - (a.updatedYear || 0);
    }
    return a.title.localeCompare(b.title);
  }

  function sortHighlightedProjects(items) {
    const highlighted = [...items];
    highlighted.sort((a, b) => {
      const aIndex = HIGHLIGHT_PRIORITY_INDEX.get(normalizeTitle(a.title));
      const bIndex = HIGHLIGHT_PRIORITY_INDEX.get(normalizeTitle(b.title));
      const safeA = Number.isInteger(aIndex) ? aIndex : Number.MAX_SAFE_INTEGER;
      const safeB = Number.isInteger(bIndex) ? bIndex : Number.MAX_SAFE_INTEGER;

      if (safeA !== safeB) {
        return safeA - safeB;
      }

      return compareByDate(a, b, 'started');
    });
    return highlighted;
  }

  function sortProjects(items) {
    const projects = [...items];
    projects.sort((a, b) => compareByDate(a, b, sortMode));
    return projects;
  }

  function getCurrentSortMode() {
    const sortSelect = document.getElementById('projects-sort');
    if (!sortSelect) {
      return sortMode;
    }
    if (sortSelect.value === 'updated') {
      return 'updated';
    }
    if (sortSelect.value === 'started') {
      return 'started';
    }
    return 'highlights';
  }

  function syncSortPickerUi(select, picker) {
    const valueEl = picker.querySelector('.projects-sort-value');
    const options = picker.querySelectorAll('.projects-sort-option');
    const selectedOption = select.options[select.selectedIndex];

    if (valueEl && selectedOption) {
      valueEl.textContent = selectedOption.textContent;
    }

    options.forEach(function (optionEl) {
      const isSelected = optionEl.getAttribute('data-value') === select.value;
      optionEl.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }

  function closeSortPicker(picker, trigger) {
    picker.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    picker.querySelector('.projects-sort-menu').hidden = true;
  }

  function openSortPicker(picker, trigger) {
    picker.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    const menu = picker.querySelector('.projects-sort-menu');
    menu.hidden = false;
    const selected = menu.querySelector('[aria-selected="true"]') || menu.querySelector('.projects-sort-option');
    if (selected) {
      selected.focus();
    }
  }

  function initProjectsSortPicker(select) {
    if (!select || select.dataset.pickerReady === 'true') {
      return;
    }

    const label = document.querySelector('label[for="projects-sort"]');
    if (label && !label.id) {
      label.id = 'projects-sort-label';
    }

    const picker = document.createElement('div');
    picker.className = 'projects-sort-picker';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'projects-sort-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'projects-sort-listbox');
    if (label) {
      trigger.setAttribute('aria-labelledby', label.id);
    }

    const valueEl = document.createElement('span');
    valueEl.className = 'projects-sort-value';
    trigger.appendChild(valueEl);

    const menu = document.createElement('ul');
    menu.className = 'projects-sort-menu';
    menu.id = 'projects-sort-listbox';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    Array.from(select.options).forEach(function (option) {
      const optionEl = document.createElement('li');
      optionEl.className = 'projects-sort-option';
      optionEl.setAttribute('role', 'option');
      optionEl.setAttribute('data-value', option.value);
      optionEl.setAttribute('tabindex', '-1');
      optionEl.textContent = option.textContent;
      menu.appendChild(optionEl);
    });

    select.classList.add('projects-sort-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    select.parentNode.insertBefore(picker, select);
    picker.appendChild(trigger);
    picker.appendChild(menu);
    picker.appendChild(select);

    function chooseValue(value) {
      if (select.value === value) {
        closeSortPicker(picker, trigger);
        trigger.focus();
        return;
      }

      select.value = value;
      syncSortPickerUi(select, picker);
      select.dispatchEvent(new Event('change', { bubbles: true }));
      closeSortPicker(picker, trigger);
      trigger.focus();
    }

    trigger.addEventListener('click', function () {
      if (picker.classList.contains('is-open')) {
        closeSortPicker(picker, trigger);
      } else {
        openSortPicker(picker, trigger);
      }
    });

    menu.addEventListener('click', function (event) {
      const optionEl = event.target.closest('.projects-sort-option');
      if (!optionEl) {
        return;
      }
      chooseValue(optionEl.getAttribute('data-value'));
    });

    menu.addEventListener('keydown', function (event) {
      const options = Array.from(menu.querySelectorAll('.projects-sort-option'));
      const currentIndex = options.indexOf(document.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        options[nextIndex].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        options[prevIndex].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (document.activeElement.classList.contains('projects-sort-option')) {
          chooseValue(document.activeElement.getAttribute('data-value'));
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeSortPicker(picker, trigger);
        trigger.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        options[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        options[options.length - 1].focus();
      }
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!picker.classList.contains('is-open')) {
          openSortPicker(picker, trigger);
        }
      } else if (event.key === 'Escape') {
        closeSortPicker(picker, trigger);
      }
    });

    document.addEventListener('click', function (event) {
      if (!picker.contains(event.target)) {
        closeSortPicker(picker, trigger);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && picker.classList.contains('is-open')) {
        closeSortPicker(picker, trigger);
        trigger.focus();
      }
    });

    syncSortPickerUi(select, picker);
    select.dataset.pickerReady = 'true';
  }

  function renderProjectsTimeline() {
    const root = document.getElementById('projects-timeline');
    if (!root || !Array.isArray(window.PROJECTS_DATA)) {
      return;
    }

    sortMode = getCurrentSortMode();
    root.setAttribute('data-sort-mode', sortMode);
    document.body.setAttribute('data-projects-sort-mode', sortMode);

    const projects = sortProjects(window.PROJECTS_DATA);

    const timelineGroups = [];

    if (sortMode === 'highlights') {
      const highlighted = sortHighlightedProjects(
        projects.filter((project) => isHighlightedProject(project))
      );
      const others = projects.filter((project) => !isHighlightedProject(project));

      if (highlighted.length) {
        timelineGroups.push({
          key: 'project-highlights',
          label: 'Project Highlights',
          ariaLabel: 'Highlighted projects',
          items: highlighted
        });
      }

      if (others.length) {
        timelineGroups.push({
          key: 'all-projects',
          label: 'All Projects',
          ariaLabel: 'All other projects',
          items: others
        });
      }
    } else {
      const yearGroups = new Map();
      projects.forEach((project) => {
        const year = sortMode === 'updated' ? (project.updatedYear || 0) : (project.startedYear || 0);
        if (!yearGroups.has(year)) {
          yearGroups.set(year, []);
        }
        yearGroups.get(year).push(project);
      });

      const years = [...yearGroups.keys()].sort((a, b) => b - a);
      years.forEach((year) => {
        const yearLabel = year ? String(year) : 'Undated';
        const groupLabel = sortMode === 'updated' ? 'updated in' : 'started in';
        timelineGroups.push({
          key: String(year),
          label: yearLabel,
          ariaLabel: `Projects ${groupLabel} ${yearLabel}`,
          items: yearGroups.get(year) || []
        });
      });
    }

    function stripCategoryIcons(value) {
      return String(value || '')
        .replace(/^[^A-Za-z0-9]+\s*/u, '')
        .trim();
    }

    root.innerHTML = timelineGroups
      .map((group) => {
        const items = group.items || [];
        return `
          <section class="timeline-year-group" aria-label="${escapeHtml(group.ariaLabel)}">
            <div class="timeline-year">${escapeHtml(group.label)}</div>
            <div class="timeline-items">
              ${items
                .map((project) => {
                  const stack = (project.stack || [])
                    .map((item) => item.replace(/^[A-Za-z\s/&]+:\s*/, ''))
                    .map((item) => `<li class="project-chip">${escapeHtml(item)}</li>`)
                    .join('');

                  const highlights = (project.highlights || [])
                    .map((item) => `<li>${escapeHtml(item)}</li>`)
                    .join('');

                  const metrics = (project.metrics || []).map((item) => escapeHtml(item)).join(' · ');

                  return `
                    <article class="timeline-card">
                      <p class="project-category">${escapeHtml(stripCategoryIcons(project.category || 'Project'))}</p>
                      <h3 class="project-title">${escapeHtml(project.title || 'Untitled Project')}</h3>
                      <p class="project-tagline">${escapeHtml(project.tagline || '')}</p>
                      <p class="project-dates">Started ${escapeHtml(project.started || 'Unknown')} • Updated ${escapeHtml(project.lastUpdated || 'Unknown')}</p>
                      ${metrics ? `<p class="project-metrics">${metrics}</p>` : ''}
                      ${stack ? `<ul class="project-chips" aria-label="Tech stack">${stack}</ul>` : ''}
                      ${highlights ? `<ul class="project-highlights">${highlights}</ul>` : ''}
                    </article>
                  `;
                })
                .join('')}
            </div>
          </section>
        `;
      })
      .join('');

    const total = document.getElementById('projects-total');
    const range = document.getElementById('projects-range');
    const categories = document.getElementById('projects-categories');

    if (total) {
      total.textContent = String(projects.length);
    }

    if (range) {
      const validYears = projects.map((project) => project.startedYear).filter((year) => year > 0);
      if (validYears.length > 0) {
        const minYear = Math.min(...validYears);
        const maxYear = Math.max(...validYears);
        range.textContent = minYear === maxYear ? String(minYear) : `${minYear}–${maxYear}`;
      } else {
        range.textContent = 'n/a';
      }
    }

    if (categories) {
      const uniqueCategories = new Set(projects.map((project) => project.category).filter(Boolean));
      categories.textContent = String(uniqueCategories.size);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.getElementById('projects-sort');
    if (sortSelect) {
      initProjectsSortPicker(sortSelect);
      sortSelect.value = 'highlights';
      const picker = sortSelect.closest('.projects-sort-picker');
      if (picker) {
        syncSortPickerUi(sortSelect, picker);
      }

      const handleSortChange = function () {
        sortMode = getCurrentSortMode();
        renderProjectsTimeline();
      };

      sortSelect.addEventListener('change', handleSortChange);
      sortSelect.addEventListener('input', handleSortChange);
      sortSelect.addEventListener('keyup', handleSortChange);
      sortSelect.addEventListener('blur', handleSortChange);
    }

    renderProjectsTimeline();
  });
})();
