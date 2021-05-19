const router = require('express').Router();
const { Client } = require('podcast-api');
const Podcast = require('../model/podcast');
// const withAuth = require('../utils/auth')

const client = Client({
  apiKey: process.env.LISTEN_API_KEY || null
});

router.get('/', (req, res) => {
  // if (req.session.logged_in) {
  //   res.redirect('/search');
  //   return;
  // }
  res.render('login');
});



router.get('/search', (req, res) => {
  res.render('search',
    // { 
    //   logged_in: req.session.logged_in
    //  }
  );
});


router.get('/results/random', (req, res) => {
  try {
    client.justListen({
    })
      .then((response) => {
        console.log('this is data:', response.data)
        const podcasts = [{ 
          link: response?.data?.link,
          thumbnail: response?.data?.thumbnail,
          title: response?.data?.title,
          description: response?.data?.description,
        }]
        console.log(podcasts)
        res.render('results', {
          podcasts,
          // loggedIn: req.session.loggedIn
        });
      });
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.get('/results/:userinput', (req, res) => {
  try {
    client.search({
      q: req.params.userinput,
      type: 'episode',
      offset: 0,
      only_in: 'title,description,author',
      language: 'English',
      safe_mode: 0,
    })
      .then((response) => {
        const podcasts = response.data.results.map(podcast => {
          return {
            link: podcast.link,
            thumbnail: podcast.thumbnail,
            title: podcast.title_original,
            description: podcast.description_original
          };
        });
        // console.log(podcasts)
        console.log(response.data);
        res.render('results', {
          podcasts,
          // logged_in: req.session.logged_in
        });
      });
  }
  catch (err) {
    res.status(500).json(err);
  }
});


router.get('/profile/playlist', (req, res) => {
  try {
    client.fetchMyPlaylists({
    })
      .then((response) => {
        console.log(response.data);
        res.render('profile', {
          // loggedIn: req.session.loggedIn
        });
      });
  }
  catch (err) {
    res.status(500).json(err);
  }
});


router.get('/profile', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.name, {
      attributes: { exclude: ['password'] },
      include: [{ model: Podcast }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
