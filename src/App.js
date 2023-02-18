import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { stringify } from "qs";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

function App() {
  const [search, setSearch] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [returnedAlbums, setReturnedAlbums] = useState([]);

  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.REACT_APP_CLIENT_ID,
      password: process.env.REACT_APP_CLIENT_SECRECT,
    },
  };
  const data = {
    grant_type: "client_credentials",
  };

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      stringify(data),
      headers
    );
    setAccessToken(response.data.access_token);
  };

  const handleClick = async (e) => {
    let authParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    let artistId = await axios.get(
      `https://api.spotify.com/v1/search?q=${search}&type=artist`,
      authParams
    );
    let album = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId.data.artists.items[0].id}/albums?include_groups=album&market=US&limit=50`,
      authParams
    );
    setReturnedAlbums(album.data.items);
  };

  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleClick}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {returnedAlbums.map((i) => {
            return (
              <Card>
                <Card.Img src={i.images[0].url} />
                <Card.Body>
                  <Card.Title>{i.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
