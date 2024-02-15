import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Card from 'react-bootstrap/Card';

const movieBaseURL = 'https://www.omdbapi.com/?apikey=258a2345&t=';
const movieSelectorDefaultValue = 'Select an option';
const regexNumerals = new RegExp(/[0-9]/g);

function RenderMovieInfo(movieData) {
  // Debug
  //console.log("[Render] Movie Data.", movieData);

  function convertRuntimeDuration(duration) {
    const durationParsed = parseInt(duration);
    const hours = Math.floor(durationParsed / 60);
    const minutes = durationParsed % 60;

    return `${hours} hours ${minutes} minutes`;
  }

  return (
    <Row className="d-flex justify-content-center">
      <Card className="d-flex flex-column align-items-start w-75 pb-3">
        {/* ----------------------- */}
        {/* Title */}
        <Card.Title className="d-flex flex-column align-items-center w-100">
          {movieData.Title}
        </Card.Title>
        {/* ----------------------- */}
        {/* Poster */}
        <Card.Body className="d-flex flex-column align-items-center w-100">
          {movieData.Poster && (<Card.Img className="w-50" src={new URL(movieData.Poster, import.meta.url)}></Card.Img>)}
        </Card.Body>
        {/* ----------------------- */}
        {/* Release Date */}
        <Card.Text className="d-flex align-items-center">
          <span className="fs-5 fw-bold">Release Date:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="fs-6">{movieData.Released}</span>
        </Card.Text>
        {/* ----------------------- */}
        {/* Release Date */}
        <Card.Text className="d-flex align-items-center">
          <span className="fs-5 fw-bold">Duration:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="fs-6">{convertRuntimeDuration(movieData.Runtime.match(regexNumerals).join(''))}</span>
        </Card.Text>
        {/* ----------------------- */}
        {/* Plot */}
        <Card.Text className="fs-5 fw-bold">
          Summary:
        </Card.Text>

        <Card.Text>
          {movieData.Plot}
        </Card.Text>
        {/* ----------------------- */}
        {/* Writers */}
        <Row className="w-100">
          <Col className="col-sm-6 col-12">
            <Card.Body className="col-md-6 m-0 p-0">
              <Card.Text className="fs-5 fw-bold">
                Writers:
              </Card.Text>

              <ul>
                {movieData.Writer.split(',').map((actor, index) => (
                  <li key={`writer-${index}`}>{actor}</li>
                ))}
              </ul>
            </Card.Body>
          </Col>

          {/* Casts */}
          <Col className="col-sm-6 col-12">
            <Card.Body className="m-0 p-0">
              <Card.Text className="fs-5 fw-bold">
                Actors:
              </Card.Text>

              <ul>
                {movieData.Actors.split(',').map((actor, index) => (
                  <li key={`actor-${index}`}>{actor}</li>
                ))}
              </ul>
            </Card.Body>
          </Col>
        </Row>
        {/* ----------------------- */}
        {/* Metacritic Score */}
        <Card.Text className="d-flex align-items-center">
          <span className="fs-5 fw-bold">Metacritic Score:&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="fs-6">{movieData.imdbRating + "/10"}</span>
        </Card.Text>
        {/* ----------------------- */}
      </Card >
    </Row >
  );
}

function App() {
  const options = [
    "Titanic",
    "Avatar",
    "Avatar: The Last Airbender",
    "John Wick",
    "Iron Man 2",
    "Captain America: Civil War",
    "Spider-Man: Homecoming",
    "Black Panther"
  ];
  const [movieName, setMovieName] = useState(movieSelectorDefaultValue);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onMovieOptionChangedHandler = (event) => setMovieName(event.target.value);

  useEffect(() => {
    setMovieData(null);
    if (movieName !== movieSelectorDefaultValue) {
      setLoading(true);
      const fullURL = movieBaseURL + encodeURIComponent(movieName);

      // Debug
      //console.log("[Fetch] URL: " + fullURL);

      fetch(fullURL)
        .then((response) => response.json())
        .then((data) => {
          // Debug
          //console.log("Response.", data.Response);

          if (!data.Response !== undefined && data.Response === "False")
            throw new Error(`Failed to retrieve movie title [${movieName}].`);

          // Debug
          //console.log("[Fetch] Data.", data);

          setMovieData(data);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [movieName]);

  return (
    <>
      <Container fluid className="page-layout pb-4" style={{ height: movieData ? "100%" : "100vh" }}>
        <Row>
          <Col className="col-12 d-flex justify-content-center mt-3">
            <h1 style={{ width: "fit-content" }}>OMDB Movie Search Engine</h1>
          </Col>
          <Col className="col-12 d-flex justify-content-center mt-3">
            <select onChange={onMovieOptionChangedHandler}>
              <option>{movieSelectorDefaultValue}</option>
              {
                options.map((option, index) => {
                  return (
                    <option key={`movie-${index}`}>{option}</option>
                  );
                })
              }
            </select>
          </Col>
          <Col className="col-12 d-flex justify-content-center mt-3">
            {loading && <p>Loading...</p>}
          </Col>
        </Row>
        {movieData && RenderMovieInfo(movieData)}
      </Container>
    </>
  )
}

export default App
