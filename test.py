from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

# consult mentor

class FlaskTests(TestCase):
  def setUp(self):
    '''To do before every test.'''
    
    self.client = app.test_client()
    app.config['TESTING'] = True
      
  def test_home(self):
    '''Display session stats and HTML'''
        
    with self.client:
      response = self.client.get('/')
      self.assertIn('board', session)
      self.assertIsNone(session.get('highscore'))
      self.assertIsNone(session.get('nplays'))
      self.assertIn('Highscore:', response.data(as_text=True))
      
  def test_valid_word(self):
      """Test if word is valid by modifying the board in the session"""
      
      with self.client as client:
          with client.session_transaction() as sess:
              sess['board'] = [["C", "A", "T", "T", "T"], 
                               ["C", "A", "T", "T", "T"], 
                               ["C", "A", "T", "T", "T"], 
                               ["C", "A", "T", "T", "T"], 
                               ["C", "A", "T", "T", "T"]]
      response = self.client.get('/check-word?word=cat')
      self.assertEqual(response.json['result'], 'ok')

  def test_invalid_word(self):
      """Test if word is in the dictionary"""
      self.client.get('/')
      response = self.client.get('/check-word?word=impossible')
      self.assertEqual(response.json['result'], 'not-on-board')
      
  def non_english_word(self):
      """Test if word is on the board"""
      
      self.client.get('/')
      response = self.client.get(
          '/check-word?word=fsjdakfkldsfjdslkfjdlksf')
      self.assertEqual(response.json['result'], 'not-word')