const CACHE_KEY = 'medium-posts';
const CACHE_DURATION = 3600000; 
const FETCH_TIMEOUT = 5000; 
const MEDIUM_USERNAME = 'canpolat.dev';

// Ana fonksiyon
async function fetchMediumPosts() {
  try {
    const cachedData = checkCache();
    if (cachedData) {
      renderPosts(cachedData);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`,
      {
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "ok" && data.items?.length) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: data.items
      }));

      renderPosts(data.items);
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    handleError(error);
  }
}

function checkCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  } catch {
    return null;
  }
}

function renderPosts(posts) {
  const postsContainer = document.getElementById("medium-posts");
  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    const publishDate = new Date(post.pubDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

    const listItem = document.createElement("li");
    listItem.className = "text mb-4";

    listItem.innerHTML = `
      <a 
        href="${post.link}" 
        target="_blank" 
        rel="noopener"
        title="${post.title}"
      >
        <p>${post.title}</p>
        <span class="text-small text-gray-500 ml-auto">${publishDate}</span>
      </a>
    `;

    fragment.appendChild(listItem);
  });

  postsContainer.appendChild(fragment);
}

function handleError(error) {
  console.error("Error fetching Medium posts:", error);
  const postsContainer = document.getElementById("medium-posts");
  
  const errorMessage = error.name === 'AbortError' 
    ? 'Request timed out. Please try again.' 
    : 'Failed to load articles';

  postsContainer.innerHTML = `
    <li class="text-red-500 font-bold mb-4">${errorMessage}</li>
  `;
}

document.addEventListener("DOMContentLoaded", fetchMediumPosts);

window.addEventListener('beforeunload', () => {
  localStorage.removeItem(CACHE_KEY);
});

export { fetchMediumPosts };