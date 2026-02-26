from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from sisen.survey.permissions import IsAdmin
from sisen.survey.models import EducationalProduct, ProductSuggestion, ClassProduct, Class, StudyOption, EducationalType

@api_view(['GET'])
@permission_classes((IsAuthenticated, IsAdmin))
def admin_home(request, format=None):
    return Response('Admin home is still under development, %s' % request.user.username)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Should ideally restrict to Revisor group
def get_pending_products(request):
    """
    Returns products that are in 'PENDING' status for the Revisor dashboard.
    """
    # Filter for PENDING products in the Suggestion table
    products = ProductSuggestion.objects.filter(status='PENDING').order_by('-created_at')
    
    data = []
    for p in products:
        # Get styles and intelligences as list of IDs for the edit form
        styles_list = list(p.styles.values_list('code', flat=True))
        intelligences_list = list(p.intelligences.values_list('code', flat=True))
        
        item = {
            'id': p.id,
            'name': p.name,
            'link': p.link,
            'info': p.info,
            'type': p.type.id,
            'type_name': p.type.name,
            'suggested_by_name': p.suggested_by.get_full_name() if p.suggested_by else 'Unknown',
            'suggested_for_class_name': p.suggested_for_class.description if p.suggested_for_class else None,
            'suggested_for_class_id': p.suggested_for_class.id if p.suggested_for_class else None,
            'styles_list': styles_list,
            'intelligences_list': intelligences_list
        }
        data.append(item)
        
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_product(request, product_id):
    """
    Handles Approval or Rejection of a product suggestion.
    """
    try:
        # We are reviewing a SUGGESTION, not a live product
        suggestion = ProductSuggestion.objects.get(pk=product_id)
    except ProductSuggestion.DoesNotExist:
        return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')
    
    if action == 'APPROVE':
        # 1. CREATE the actual EducationalProduct
        type_id = request.data.get('type_id', suggestion.type.id)
        product_type = EducationalType.objects.get(pk=type_id)
        
        # We use data sent from the dashboard (in case the revisor edited it)
        new_product = EducationalProduct.objects.create(
            name=request.data.get('name', suggestion.name),
            link=request.data.get('link', suggestion.link),
            info=request.data.get('description', suggestion.info),
            type=product_type,
            suggested_by=suggestion.suggested_by
        )
        
        # 2. Copy Relations (Styles & Intelligences)
        if 'styles' in request.data:
            styles = StudyOption.objects.filter(code__in=request.data['styles'])
            new_product.styles.set(styles)
            
        if 'intelligences' in request.data:
            intels = StudyOption.objects.filter(code__in=request.data['intelligences'])
            new_product.intelligences.set(intels)
            
        new_product.save()
        
        # 3. Handle Context (Class Link)
        # Logic: If it was suggested for a class (and "Restrict to Class" is checked), 
        # link it only to that class.
        
        restrict_to_class = request.data.get('restrict_to_class', False)
        
        if restrict_to_class and suggestion.suggested_for_class:
            # Create the link so it's private to this class
            ClassProduct.objects.get_or_create(
                class_id=suggestion.suggested_for_class, 
                product=new_product
            )
        
        # 4. Mark suggestion as approved so it disappears from the dashboard
        suggestion.status = 'APPROVED'
        suggestion.save()
        
        return Response({'message': 'Product approved successfully'})
        
    elif action == 'REJECT':
        # Mark as Rejected (keep for history)
        suggestion.status = 'REJECTED'
        suggestion.rejection_reason = request.data.get('reason', '')
        suggestion.save()
        
        return Response({'message': 'Suggestion rejected'})
        
    return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)