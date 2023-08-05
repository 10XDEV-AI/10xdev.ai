import mixpanel

mixpanel_client = mixpanel.Mixpanel('597ffd5c8a8491e60f4373120abecddb')
def track_event(event_name, properties):
    mixpanel_client.track(properties['email'], event_name, properties)

