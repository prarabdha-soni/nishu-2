#!/usr/bin/env python3
"""
Voice Interview Scoring System
"""
import logging
import re
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class VoiceInterviewScorer:
    """Scoring system for voice-based interviews"""
    
    def __init__(self):
        self.scoring_criteria = {
            'technical_knowledge': {
                'weight': 0.3,
                'keywords': ['java', 'javascript', 'python', 'react', 'node', 'sql', 'database', 'api', 'aws', 'docker', 'git', 'html', 'css', 'framework', 'library', 'algorithm', 'data structure', 'oop', 'mvc', 'rest', 'json', 'xml']
            },
            'communication_skills': {
                'weight': 0.25,
                'indicators': ['explain', 'describe', 'walk through', 'example', 'experience', 'project', 'challenge', 'solution', 'learned', 'improved']
            },
            'problem_solving': {
                'weight': 0.2,
                'keywords': ['debug', 'troubleshoot', 'fix', 'solve', 'issue', 'problem', 'challenge', 'optimize', 'improve', 'refactor', 'test']
            },
            'experience_depth': {
                'weight': 0.15,
                'indicators': ['years', 'experience', 'worked on', 'developed', 'built', 'implemented', 'designed', 'architected', 'led', 'managed', 'team']
            },
            'enthusiasm': {
                'weight': 0.1,
                'indicators': ['excited', 'passionate', 'love', 'enjoy', 'interesting', 'fascinating', 'amazing', 'great', 'awesome', 'motivated']
            }
        }
    
    def score_response(self, response_text: str, question_context: str = "") -> Dict[str, Any]:
        """Score a candidate's response"""
        try:
            response_lower = response_text.lower()
            
            # Calculate scores for each criterion
            scores = {}
            total_score = 0
            
            for criterion, config in self.scoring_criteria.items():
                score = self._calculate_criterion_score(response_lower, config)
                scores[criterion] = score
                total_score += score * config['weight']
            
            # Determine overall rating
            rating = self._get_rating(total_score)
            
            # Generate feedback
            feedback = self._generate_feedback(scores, response_text)
            
            return {
                'overall_score': round(total_score, 2),
                'rating': rating,
                'criterion_scores': scores,
                'feedback': feedback,
                'timestamp': datetime.now().isoformat(),
                'response_length': len(response_text),
                'word_count': len(response_text.split())
            }
            
        except Exception as e:
            logger.error(f"Error scoring response: {e}")
            return {
                'overall_score': 0.0,
                'rating': 'Poor',
                'criterion_scores': {},
                'feedback': 'Unable to score response due to technical error.',
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }
    
    def _calculate_criterion_score(self, response_text: str, config: Dict) -> float:
        """Calculate score for a specific criterion"""
        keywords = config.get('keywords', [])
        indicators = config.get('indicators', [])
        
        score = 0.0
        max_score = 10.0
        
        # Check for keywords
        keyword_matches = sum(1 for keyword in keywords if keyword in response_text)
        if keywords:
            keyword_score = min(keyword_matches / len(keywords) * 5, 5.0)
            score += keyword_score
        
        # Check for indicators
        indicator_matches = sum(1 for indicator in indicators if indicator in response_text)
        if indicators:
            indicator_score = min(indicator_matches / len(indicators) * 5, 5.0)
            score += indicator_score
        
        return min(score, max_score)
    
    def _get_rating(self, score: float) -> str:
        """Convert numeric score to rating"""
        if score >= 8.0:
            return 'Excellent'
        elif score >= 6.5:
            return 'Good'
        elif score >= 5.0:
            return 'Average'
        elif score >= 3.0:
            return 'Below Average'
        else:
            return 'Poor'
    
    def _generate_feedback(self, scores: Dict[str, float], response_text: str) -> str:
        """Generate personalized feedback"""
        feedback_parts = []
        
        # Technical knowledge feedback
        if scores.get('technical_knowledge', 0) >= 7:
            feedback_parts.append("Strong technical knowledge demonstrated.")
        elif scores.get('technical_knowledge', 0) >= 5:
            feedback_parts.append("Good technical understanding shown.")
        else:
            feedback_parts.append("Consider expanding technical knowledge in relevant areas.")
        
        # Communication feedback
        if scores.get('communication_skills', 0) >= 7:
            feedback_parts.append("Excellent communication and explanation skills.")
        elif scores.get('communication_skills', 0) >= 5:
            feedback_parts.append("Good communication skills demonstrated.")
        else:
            feedback_parts.append("Work on providing more detailed explanations and examples.")
        
        # Problem-solving feedback
        if scores.get('problem_solving', 0) >= 7:
            feedback_parts.append("Strong problem-solving approach evident.")
        elif scores.get('problem_solving', 0) >= 5:
            feedback_parts.append("Good problem-solving mindset shown.")
        else:
            feedback_parts.append("Consider discussing specific problem-solving experiences.")
        
        # Experience feedback
        if scores.get('experience_depth', 0) >= 7:
            feedback_parts.append("Rich experience and depth of knowledge.")
        elif scores.get('experience_depth', 0) >= 5:
            feedback_parts.append("Good level of experience demonstrated.")
        else:
            feedback_parts.append("Consider sharing more specific project experiences.")
        
        return " ".join(feedback_parts)
    
    def score_interview_session(self, conversation_history: List[Dict]) -> Dict[str, Any]:
        """Score an entire interview session"""
        try:
            all_scores = []
            total_responses = 0
            
            for turn in conversation_history:
                if turn.get('type') == 'candidate':
                    response_text = turn.get('content', '')
                    if response_text.strip():
                        score_data = self.score_response(response_text)
                        all_scores.append(score_data)
                        total_responses += 1
            
            if not all_scores:
                return {
                    'session_score': 0.0,
                    'session_rating': 'No Responses',
                    'total_responses': 0,
                    'average_scores': {},
                    'overall_feedback': 'No candidate responses to evaluate.',
                    'timestamp': datetime.now().isoformat()
                }
            
            # Calculate average scores
            avg_scores = {}
            for criterion in self.scoring_criteria.keys():
                criterion_scores = [score['criterion_scores'].get(criterion, 0) for score in all_scores]
                avg_scores[criterion] = sum(criterion_scores) / len(criterion_scores) if criterion_scores else 0
            
            # Calculate overall session score
            session_score = sum(score['overall_score'] for score in all_scores) / len(all_scores)
            session_rating = self._get_rating(session_score)
            
            # Generate overall feedback
            overall_feedback = self._generate_session_feedback(avg_scores, total_responses)
            
            return {
                'session_score': round(session_score, 2),
                'session_rating': session_rating,
                'total_responses': total_responses,
                'average_scores': avg_scores,
                'overall_feedback': overall_feedback,
                'individual_scores': all_scores,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error scoring interview session: {e}")
            return {
                'session_score': 0.0,
                'session_rating': 'Error',
                'total_responses': 0,
                'average_scores': {},
                'overall_feedback': 'Unable to score interview session due to technical error.',
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }
    
    def _generate_session_feedback(self, avg_scores: Dict[str, float], total_responses: int) -> str:
        """Generate overall session feedback"""
        feedback_parts = []
        
        feedback_parts.append(f"Based on {total_responses} responses:")
        
        # Find strongest and weakest areas
        strongest_area = max(avg_scores.items(), key=lambda x: x[1]) if avg_scores else ('none', 0)
        weakest_area = min(avg_scores.items(), key=lambda x: x[1]) if avg_scores else ('none', 0)
        
        if strongest_area[1] >= 7:
            feedback_parts.append(f"Strongest area: {strongest_area[0].replace('_', ' ').title()}")
        
        if weakest_area[1] < 5:
            feedback_parts.append(f"Area for improvement: {weakest_area[0].replace('_', ' ').title()}")
        
        # Overall recommendation
        overall_avg = sum(avg_scores.values()) / len(avg_scores) if avg_scores else 0
        if overall_avg >= 7:
            feedback_parts.append("Overall: Strong candidate with good potential.")
        elif overall_avg >= 5:
            feedback_parts.append("Overall: Good candidate with room for growth.")
        else:
            feedback_parts.append("Overall: Candidate needs significant development.")
        
        return " ".join(feedback_parts)

# Global scorer instance
voice_scorer = VoiceInterviewScorer()
