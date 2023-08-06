import logging
import os

class UserLogger:
    def __init__(self, user_id):
        self.user_id = user_id
        self.logger = logging.getLogger(f"UserLogger-{user_id}")
        self.log_history = []
        self.MAX_LOGS = 100
        self.completion_percentage = 0  # New variable to track percentage completion
        self.estimated_time = 0  # New variable to estimate how much time it will take

    # Create a file handler and set the level to INFO
        handler = logging.FileHandler(os.path.join("../user", user_id,'AIFiles', 'AI.log'))
        handler.setLevel(logging.INFO)

        # Create a formatter and add it to the handler
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)

        # Add the handler to the logger
        self.logger.addHandler(handler)

    def log(self, msg="Dummy Log message", percent="", time_left=""):
        """Logs a message to the logger and stores it in log_history."""
        self.logger.info(msg)
        if msg is not "":
            self.log_history.append(msg)
        if percent != "":
            self.completion_percentage = percent
        if time_left != "":
            self.estimated_time = time_left
        if len(self.log_history) > self.MAX_LOGS:
            self.log_history.pop(0)

    def get_last_logs(self, n=15):
        """Returns the last n log statements from log_history."""
        return self.log_history[-n:], self.completion_percentage, self.estimated_time

    def clear_logs(self):
        """Clears the log_history."""
        self.completion_percentage = ""
        self.estimated_time = ""
        self.log_history.clear()
