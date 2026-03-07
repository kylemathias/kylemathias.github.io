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
      sortSelect.value = 'highlights';
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
