import 'bootstrap/dist/css/bootstrap.min.css';

const app = document.getElementById('app');

app.innerHTML = `
  <div class="container py-5">
    <h1 class="mb-4">Добавить RSS-поток</h1>
    <form id="rss-form" class="row g-3">
      <div class="col-md-8">
        <input 
          type="url" 
          class="form-control" 
          id="rss-url" 
          placeholder="Введите ссылку на RSS" 
          required 
        />
      </div>
      <div class="col-md-4">
        <button type="submit" class="btn btn-primary w-100">Добавить</button>
      </div>
    </form>
    <div id="feedback" class="form-text mt-3"></div>
  </div>
`;

document.getElementById('rss-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const url = document.getElementById('rss-url').value;
  const feedback = document.getElementById('feedback');
  feedback.textContent = `Введённый RSS: ${url}`;
});
