import React, { useEffect, useState } from "react";
import {
  Container, Typography, Box, Card, CardContent, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function App() {
  const { t, i18n } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heats, setHeats] = useState([]);
  const [form, setForm] = useState({
    name: "",
    athlete1: "",
    athlete2: "",
    category_id: "",
    heat_id: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setTeams((await axios.get(`${API_URL}/teams`)).data);
    setCategories((await axios.get(`${API_URL}/categories`)).data);
    setHeats((await axios.get(`${API_URL}/heats`)).data);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTeam = async () => {
    await axios.post(`${API_URL}/teams`, form);
    setForm({ name: "", athlete1: "", athlete2: "", category_id: "", heat_id: "" });
    fetchAll();
  };

  const handleScoreChange = async (id, score) => {
    await axios.put(`${API_URL}/teams/${id}/score`, { score });
    fetchAll();
  };

  const handleDeleteTeam = async (id) => {
    await axios.delete(`${API_URL}/teams/${id}`);
    fetchAll();
  };

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">LiveInMagic Scoring</Typography>
        <Box>
          <Button onClick={() => handleLangChange("fr")}>FR</Button>
          <Button onClick={() => handleLangChange("en")}>EN</Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>{t("add_team")}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <TextField label={t("team_name")} name="name" value={form.name} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label={t("athlete1")} name="athlete1" value={form.athlete1} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label={t("athlete2")} name="athlete2" value={form.athlete2} onChange={handleFormChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>{t("category")}</InputLabel>
                <Select name="category_id" value={form.category_id} label={t("category")} onChange={handleFormChange}>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>{t("heat")}</InputLabel>
                <Select name="heat_id" value={form.heat_id} label={t("heat")} onChange={handleFormChange}>
                  {heats.map((heat) => (
                    <MenuItem key={heat.id} value={heat.id}>{heat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" onClick={handleAddTeam} fullWidth>{t("add")}</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} lg={4} key={team.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Typography variant="body2">{t("athletes")}: {team.athlete1} & {team.athlete2}</Typography>
                <Typography variant="body2">{t("category")}: {team.category}</Typography>
                <Typography variant="body2">{t("heat")}: {team.heat}</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Button variant="outlined" onClick={() => handleScoreChange(team.id, team.score - 1)}>-</Button>
                  <Typography variant="h5" mx={2}>{team.score}</Typography>
                  <Button variant="outlined" onClick={() => handleScoreChange(team.id, team.score + 1)}>+</Button>
                </Box>
                <Button color="error" onClick={() => handleDeleteTeam(team.id)} sx={{ mt: 2 }}>{t("delete")}</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;