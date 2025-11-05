const request = require('supertest');

const baseURL = 'http://localhost:5000';

describe('Tests d\'intégration de l\'API Hybride Bookly+', () => {
    let userId;
  
  const testEmail = `user-${Date.now()}@test.com`;
  const testName = 'Alice Test Auto';

  test('1. POST /api/users - Doit créer un nouvel utilisateur', async () => {
    const response = await request(baseURL)
      .post('/api/users')
      .send({
        name: testName,
        email: testEmail
      });


    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(testName);
    expect(response.body).toHaveProperty('id');
    
    userId = response.body.id;
  });

  test('2. POST /api/profiles - Doit créer le profil NoSQL lié', async () => {
    expect(userId).toBeDefined();

    const response = await request(baseURL)
      .post('/api/profiles')
      .send({
        _id: userId, 
        preferences: { genres_favoris: ["Fantasy"] }
      });

    expect(response.statusCode).toBe(201);
    expect(response.body._id).toBe(userId);
  });

  test('3. PUT /api/profiles/:id - Doit ajouter à l\'historique', async () => {
    const response = await request(baseURL)
      .put(`/api/profiles/${userId}`) 
      .send({
        historyItem: {
          book: "Livre de Test",
          rating: 5
        }
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.history).toHaveLength(1);
    expect(response.body.history[0].rating).toBe(5);
  });

  test('4. GET /api/users/user-full/:id - Doit renvoyer les données fusionnées', async () => {
    const response = await request(baseURL)
      .get(`/api/users/user-full/${userId}`); 

    expect(response.statusCode).toBe(200);
   
    expect(response.body.id).toBe(userId);
    expect(response.body.name).toBe(testName);
    expect(response.body.email).toBe(testEmail);

    expect(response.body).toHaveProperty('profile');
    expect(response.body.profile.preferences.genres_favoris[0]).toBe("Fantasy");
    expect(response.body.profile.history[0].book).toBe("Livre de Test");
  });

});
