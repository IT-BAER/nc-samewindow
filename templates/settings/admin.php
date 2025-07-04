<div id="samewindow" class="section">
    <h2 class="inlineblock"><?php p($l->t('Same Window')); ?></h2>
    <p class="settings-hint"><?php p($l->t('Configure how links should behave on frontend widgets')); ?></p>
    
    <form id="samewindow-form">
        <div class="form-group">
            <input type="checkbox" id="samewindow-enabled" name="enabled" class="checkbox" 
                   <?php if ($_['enabled']): ?>checked="checked"<?php endif; ?> />
            <label for="samewindow-enabled"><?php p($l->t('Enable Same Window functionality')); ?></label>
            <em><?php p($l->t('When enabled, links on frontend widgets will open in the same window instead of new tabs')); ?></em>
        </div>
        
        <div class="form-group">
            <label for="samewindow-target-selectors"><?php p($l->t('Target Selectors')); ?></label>
            <input type="text" id="samewindow-target-selectors" name="target_selectors" 
                   value="<?php p($_['target_selectors']); ?>" 
                   placeholder="a[target=&quot;_blank&quot;], a[target=&quot;_new&quot;]" />
            <em><?php p($l->t('CSS selectors for links that should be modified (comma-separated)')); ?></em>
        </div>
        
        <div class="form-group">
            <label for="samewindow-exclude-selectors"><?php p($l->t('Exclude Selectors')); ?></label>
            <input type="text" id="samewindow-exclude-selectors" name="exclude_selectors" 
                   value="<?php p($_['exclude_selectors']); ?>" 
                   placeholder=".external-link, .new-window-link" />
            <em><?php p($l->t('CSS selectors for links that should be excluded from modification (comma-separated)')); ?></em>
        </div>
        
        <button type="submit" id="samewindow-submit" class="button primary">
            <?php p($l->t('Save')); ?>
        </button>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('samewindow-form');
    const submitButton = document.getElementById('samewindow-submit');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            enabled: formData.get('enabled') === 'on',
            targetSelectors: formData.get('target_selectors'),
            excludeSelectors: formData.get('exclude_selectors')
        };
        
        submitButton.disabled = true;
        submitButton.textContent = '<?php p($l->t('Saving...')); ?>';
        
        // Add debug logging
        console.log('Saving SameWindow settings:', data);
        
        // Direct web API might be more reliable
        fetch(OC.generateUrl('/apps/samewindow/config'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'requesttoken': OC.requestToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server returned ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Settings saved response:', data);
            if (data && (data.status === 'success' || (data.ocs && data.ocs.meta && data.ocs.meta.status === 'ok'))) {
                OC.Notification.showTemporary('<?php p($l->t('Settings saved successfully')); ?>');
            } else {
                OC.Notification.showTemporary('<?php p($l->t('Error saving settings')); ?>');
            }
        })
        .catch(error => {
            console.error('Error saving settings:', error);
            OC.Notification.showTemporary('<?php p($l->t('Error saving settings')); ?>');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = '<?php p($l->t('Save')); ?>';
        });
    });
});
</script>
