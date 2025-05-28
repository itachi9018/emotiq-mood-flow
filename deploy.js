
import ghpages from 'gh-pages';

ghpages.publish('dist', {
  branch: 'gh-pages',
  repo: 'https://github.com/itachi9018/emotiq-mood-flow.git', // Update this with your repo URL
  user: {
    name: 'GitHub Actions',
    email: 'actions@github.com'
  }
}, (err) => {
  if (err) {
    console.log('Error deploying to GitHub Pages:', err);
  } else {
    console.log('Successfully deployed to GitHub Pages!');
  }
});
