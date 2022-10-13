<h1 align="center">Previews+</h1>
<div id="header" align="center">
  <img src="https://media.giphy.com/media/ii7tZBbxuUicGRE2NY/giphy.gif" width=250"/>                                                                              
</div>
                                                                                  
Previews+ is a website that lets you stream your favorite movies and shows' previews! Get recomendations based on what you like, and add videos you want to see to your watchlist! This project was created as a fun personal project to recreate popular streaming service apps such as Netflix, Hulu, etc. 

## Deployed Website

The website is deployed using vercel. You can check it out at the address here: [https://previews-plus.vercel.app/](https://previews-plus.vercel.app/)

## Getting Started:
### Signin with Next-Auth
I am using next-auth to power the authentication of my app. You can sign in using Github or Google. This helps make it easier and faster for users to check out the features of my website.


### Create a Watch Profile:
Each account will be able to have 6 watch profiles. These profiles can have a custom name plus a custom avatar thanks to the many stock photos on pexels.

### Clicking on Videos:
The main feature of the website is being able to browse videos and watch the previews. Upon opening the page you will get to see the current trending page of the most popular tv shows and movies. You will also get to browse between all the popular genres. You also have the ability to browse only by movies or shows. As you use the site more it will begin to learn what your movie and show preferences are.

### Learning Your Preferences:
My website uses a very basic machine learning algorithim to determine what genres and shows you will enjoy the most. The more you use the website the more accurate of recomendations you will recieve. The algorithim works by keeping track of all the movies and shows you have clicked on and watched. It will then use this data to rank what genres you tend to go for more. The algorithim will also take ratings into account, placing movies and shows with higher ratings above all others. If you have given a video a negative rating the algorithim will omit that video from the ranks. 

### Adding videos to your Watchlist
You will be allowed to add interested videos to your watchlist. Here you can keep track of movies and shows that might interest you in the future.

## External Api:
This project uses the [TMDB Api](https://www.themoviedb.org) api. My website will connect to this api remotely to grab information on movies and shows. The project will do a lot of api requests on the server and on the client to attempt to make your user experience as smooth and easy as possible.

## Technology Stack:
- Main Framework: **Next.js**
- **React.js**
- **Next-Auth**
- **Prisma**
- **Swiper**
- **Axios**
- **Jest**
- **Bootstrap 5**
- **PostgreSQL**

## License
[MIT](https://choosealicense.com/licenses/mit/)
