from flask import Blueprint, request, jsonify
from datetime import datetime
import json
import os

feedback_bp = Blueprint('feedback', __name__)

# Simple file-based storage for prototype
FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), '..', 'database', 'feedback.json')

def load_feedback():
    """Load feedback data from JSON file"""
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_feedback(feedback_data):
    """Save feedback data to JSON file"""
    os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
    with open(FEEDBACK_FILE, 'w') as f:
        json.dump(feedback_data, f, indent=2)

@feedback_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    """Submit user feedback for Kaizen improvement cycles"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('rating') or not data.get('feedback_text'):
            return jsonify({'error': 'Rating and feedback text are required'}), 400
        
        # Load existing feedback
        feedback_list = load_feedback()
        
        # Create new feedback entry
        feedback_entry = {
            'id': len(feedback_list) + 1,
            'timestamp': datetime.now().isoformat(),
            'rating': int(data['rating']),
            'improvement_area': data.get('improvement_area', ''),
            'feedback_text': data['feedback_text'],
            'suggestion': data.get('suggestion', ''),
            'iteration_version': data.get('iteration_version', 'v1.0'),
            'user_session': data.get('user_session', 'anonymous')
        }
        
        # Add to feedback list
        feedback_list.append(feedback_entry)
        
        # Save to file
        save_feedback(feedback_list)
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback_id': feedback_entry['id'],
            'kaizen_status': 'Feedback will be analyzed for next iteration'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@feedback_bp.route('/feedback', methods=['GET'])
def get_feedback():
    """Get all feedback for analysis"""
    try:
        feedback_list = load_feedback()
        return jsonify({
            'feedback': feedback_list,
            'total_count': len(feedback_list),
            'average_rating': sum(f['rating'] for f in feedback_list) / len(feedback_list) if feedback_list else 0
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@feedback_bp.route('/feedback/analytics', methods=['GET'])
def get_feedback_analytics():
    """Get feedback analytics for Kaizen analysis"""
    try:
        feedback_list = load_feedback()
        
        if not feedback_list:
            return jsonify({
                'message': 'No feedback data available',
                'analytics': {}
            }), 200
        
        # Calculate analytics
        total_feedback = len(feedback_list)
        average_rating = sum(f['rating'] for f in feedback_list) / total_feedback
        
        # Rating distribution
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[str(i)] = len([f for f in feedback_list if f['rating'] == i])
        
        # Improvement areas frequency
        improvement_areas = {}
        for feedback in feedback_list:
            area = feedback.get('improvement_area', 'not_specified')
            improvement_areas[area] = improvement_areas.get(area, 0) + 1
        
        # Recent feedback (last 7 days)
        from datetime import datetime, timedelta
        week_ago = datetime.now() - timedelta(days=7)
        recent_feedback = [
            f for f in feedback_list 
            if datetime.fromisoformat(f['timestamp']) > week_ago
        ]
        
        analytics = {
            'total_feedback': total_feedback,
            'average_rating': round(average_rating, 2),
            'rating_distribution': rating_distribution,
            'improvement_areas': improvement_areas,
            'recent_feedback_count': len(recent_feedback),
            'kaizen_insights': {
                'most_requested_improvement': max(improvement_areas.items(), key=lambda x: x[1])[0] if improvement_areas else 'none',
                'satisfaction_level': 'high' if average_rating >= 4 else 'medium' if average_rating >= 3 else 'low',
                'feedback_trend': 'increasing' if len(recent_feedback) > total_feedback * 0.3 else 'stable'
            }
        }
        
        return jsonify({
            'analytics': analytics,
            'kaizen_recommendations': generate_kaizen_recommendations(analytics)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_kaizen_recommendations(analytics):
    """Generate Kaizen-based recommendations from feedback analytics"""
    recommendations = []
    
    # Rating-based recommendations
    if analytics['average_rating'] < 3:
        recommendations.append({
            'priority': 'high',
            'area': 'overall_experience',
            'recommendation': 'Focus on fundamental usability improvements in next iteration',
            'action': 'Conduct user testing sessions and simplify core workflows'
        })
    elif analytics['average_rating'] < 4:
        recommendations.append({
            'priority': 'medium',
            'area': 'user_satisfaction',
            'recommendation': 'Identify and address specific pain points',
            'action': 'Analyze detailed feedback for common issues and prioritize fixes'
        })
    
    # Improvement area recommendations
    most_requested = analytics['kaizen_insights']['most_requested_improvement']
    if most_requested != 'none':
        recommendations.append({
            'priority': 'high',
            'area': most_requested,
            'recommendation': f'Prioritize improvements in {most_requested} for next iteration',
            'action': f'Allocate development resources to enhance {most_requested} functionality'
        })
    
    # Feedback volume recommendations
    if analytics['total_feedback'] < 5:
        recommendations.append({
            'priority': 'medium',
            'area': 'feedback_collection',
            'recommendation': 'Increase user engagement and feedback collection',
            'action': 'Implement more feedback touchpoints and incentivize user participation'
        })
    
    return recommendations

@feedback_bp.route('/feedback/kaizen-cycle', methods=['POST'])
def create_kaizen_cycle():
    """Create a new Kaizen improvement cycle based on feedback"""
    try:
        data = request.get_json()
        cycle_name = data.get('cycle_name', f'Cycle_{datetime.now().strftime("%Y%m%d")}')
        
        # Get current feedback analytics
        feedback_list = load_feedback()
        
        # Create cycle summary
        cycle_data = {
            'cycle_name': cycle_name,
            'created_at': datetime.now().isoformat(),
            'feedback_analyzed': len(feedback_list),
            'plan_phase': {
                'objectives': data.get('objectives', []),
                'target_improvements': data.get('target_improvements', []),
                'success_metrics': data.get('success_metrics', [])
            },
            'status': 'planning'
        }
        
        # Save cycle data (in a real implementation, this would go to a database)
        cycles_file = os.path.join(os.path.dirname(FEEDBACK_FILE), 'kaizen_cycles.json')
        cycles = []
        if os.path.exists(cycles_file):
            with open(cycles_file, 'r') as f:
                cycles = json.load(f)
        
        cycles.append(cycle_data)
        
        with open(cycles_file, 'w') as f:
            json.dump(cycles, f, indent=2)
        
        return jsonify({
            'message': 'Kaizen cycle created successfully',
            'cycle': cycle_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

